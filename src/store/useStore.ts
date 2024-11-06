import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { LinkItem, Profile, Theme } from '../types';
import { handleError } from '../utils/error';

const defaultTheme: Theme = {
  backgroundColor: '#f3f4f6',
  buttonColor: '#4f46e5',
  textColor: '#111827',
  fontFamily: 'Inter',
  buttonStyle: 'rounded'
};

const defaultProfile: Profile = {
  name: '',
  bio: '',
  avatar: ''
};

interface StoreState {
  user: any;
  links: LinkItem[];
  profile: Profile;
  theme: Theme;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
  addLink: (link: LinkItem) => void;
  removeLink: (id: string) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  reorderLinks: (oldIndex: number, newIndex: number) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updateTheme: (updates: Partial<Theme>) => void;
  saveChanges: () => Promise<void>;
  setHasUnsavedChanges: (value: boolean) => void;
  signOut: () => Promise<void>;
  loadUserData: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  clearError: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  links: [],
  profile: defaultProfile,
  theme: defaultTheme,
  hasUnsavedChanges: false,
  isLoading: false,
  error: null,

  loadUserData: async () => {
    try {
      const { user } = get();
      if (!user) return;

      set({ isLoading: true, error: null });

      // Load profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && !profileError.message.includes('No rows found')) {
        throw profileError;
      }

      // Load theme
      const { data: theme, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (themeError && !themeError.message.includes('No rows found')) {
        throw themeError;
      }

      // Load links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position');
      
      if (linksError) throw linksError;

      set({
        profile: profile || defaultProfile,
        theme: theme || defaultTheme,
        links: links || [],
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error in loadUserData:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  addLink: (link) => {
    try {
      set((state) => ({ 
        links: [...state.links, link],
        hasUnsavedChanges: true
      }));
    } catch (error) {
      handleError(error, 'addLink');
    }
  },
  
  removeLink: (id) => {
    try {
      set((state) => ({ 
        links: state.links.filter((link) => link.id !== id),
        hasUnsavedChanges: true
      }));
    } catch (error) {
      handleError(error, 'removeLink');
    }
  },
  
  updateLink: (id, updates) => {
    try {
      set((state) => ({
        links: state.links.map((link) => 
          link.id === id ? { ...link, ...updates } : link
        ),
        hasUnsavedChanges: true
      }));
    } catch (error) {
      handleError(error, 'updateLink');
    }
  },
  
  reorderLinks: (oldIndex, newIndex) => {
    try {
      set((state) => {
        const links = [...state.links];
        const [removed] = links.splice(oldIndex, 1);
        links.splice(newIndex, 0, removed);
        return { links, hasUnsavedChanges: true };
      });
    } catch (error) {
      handleError(error, 'reorderLinks');
    }
  },
  
  updateProfile: (updates) => {
    try {
      set((state) => ({
        profile: { ...state.profile, ...updates },
        hasUnsavedChanges: true
      }));
    } catch (error) {
      handleError(error, 'updateProfile');
    }
  },
  
  updateTheme: (updates) => {
    try {
      set((state) => ({
        theme: { ...state.theme, ...updates },
        hasUnsavedChanges: true
      }));
    } catch (error) {
      handleError(error, 'updateTheme');
    }
  },

  saveChanges: async () => {
    try {
      const state = get();
      const { user } = state;
      if (!user) throw new Error('User not authenticated');

      set({ isLoading: true, error: null });

      // Save profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          name: state.profile.name,
          bio: state.profile.bio,
          avatar: state.profile.avatar
        });
      if (profileError) throw profileError;

      // Save theme
      const { error: themeError } = await supabase
        .from('themes')
        .upsert({
          user_id: user.id,
          ...state.theme
        });
      if (themeError) throw themeError;

      // Save links with positions
      const { error: linksError } = await supabase
        .from('links')
        .upsert(
          state.links.map((link, index) => ({
            ...link,
            user_id: user.id,
            position: index
          }))
        );
      if (linksError) throw linksError;

      set({ hasUnsavedChanges: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      handleError(error, 'saveChanges');
      throw error;
    }
  },

  setHasUnsavedChanges: (value) => {
    set({ hasUnsavedChanges: value });
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null,
        links: [],
        profile: defaultProfile,
        theme: defaultTheme,
        hasUnsavedChanges: false,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      handleError(error, 'signOut');
      throw error;
    }
  }
}));