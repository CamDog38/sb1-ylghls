import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { MobilePreview } from './components/MobilePreview';
import { ProfileSection } from './components/ProfileSection';
import { AppearanceSection } from './components/AppearanceSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { DebugConsole } from './components/DebugConsole';
import { User, Palette, BarChart3 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import clsx from 'clsx';

type TabType = 'links' | 'profile' | 'appearance' | 'analytics';

const tabs: { id: TabType; label: string; icon: any }[] = [
  { id: 'links', label: 'Links', icon: User },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('links');
  const { user, isLoading, error, loadUserData } = useStore();

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        useStore.setState({ user: session.user });
        await loadUserData();
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        useStore.setState({ user: session.user });
        await loadUserData();
      } else if (event === 'SIGNED_OUT') {
        useStore.setState({ user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'analytics':
        return <AnalyticsSection />;
      default:
        return <ProductList />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-[420px]">
        <div className="py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={clsx(
                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderContent()}
        </div>
      </main>
      
      <MobilePreview />
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            Built with ❤️ using React and TypeScript
          </p>
        </div>
      </footer>

      {/* Debug Console */}
      {import.meta.env.DEV && <DebugConsole />}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;