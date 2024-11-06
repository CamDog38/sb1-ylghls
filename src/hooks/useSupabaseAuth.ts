import { useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationSent, setConfirmationSent] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN') {
        toast.success('Signed in successfully');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      throw error;
    }

    setConfirmationSent(true);
    return true;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email to confirm your account before signing in.');
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new Error('An unexpected error occurred during sign in.');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      if (!data.session) {
        setConfirmationSent(true);
        return { confirmationRequired: true };
      }

      setUser(data.session.user);
      return { confirmationRequired: false };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new Error('An unexpected error occurred during sign up.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new Error('An unexpected error occurred during sign out.');
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
    confirmationSent,
    setConfirmationSent,
  };
}