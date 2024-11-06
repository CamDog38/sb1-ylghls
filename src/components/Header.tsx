import React, { useState } from 'react';
import { Link2, ShoppingBag, Plus, Save, LogOut } from 'lucide-react';
import { AddLinkModal } from './AddLinkModal';
import { ImportProductsModal } from './ImportProductsModal';
import { SettingsModal } from './SettingsModal';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const { hasUnsavedChanges, saveChanges, signOut } = useStore();

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      await saveChanges();
      toast.success('Changes saved successfully');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link2 className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">LinkHub</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-50"
              >
                <span className="sr-only">Settings</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                  hasUnsavedChanges
                    ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className={`w-4 h-4 md:mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </span>
              </button>
              
              <button
                onClick={() => setIsAddLinkOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:px-4"
              >
                <Plus className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Add Link</span>
              </button>
              
              <button
                onClick={() => setIsImportOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:px-4"
              >
                <ShoppingBag className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Import Products</span>
              </button>

              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningOut ? (
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin md:mr-2"></div>
                ) : (
                  <LogOut className="w-4 h-4 md:mr-2" />
                )}
                <span className="hidden md:inline">
                  {isSigningOut ? 'Signing out...' : 'Sign Out'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AddLinkModal isOpen={isAddLinkOpen} onClose={() => setIsAddLinkOpen(false)} />
      <ImportProductsModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};