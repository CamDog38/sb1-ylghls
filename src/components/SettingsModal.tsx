import React, { useState } from 'react';
import { Modal } from './Modal';
import { ProfileTab } from './settings/ProfileTab';
import { AppearanceTab } from './settings/AppearanceTab';
import { AnalyticsTab } from './settings/AnalyticsTab';
import { GeneralTab } from './settings/GeneralTab';
import { Settings, User, Palette, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'appearance' | 'analytics' | 'general';

const tabs: { id: TabType; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'general', label: 'General', icon: Settings }
];

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'appearance':
        return <AppearanceTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'general':
        return <GeneralTab />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="flex h-[600px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-gray-200 pt-2">
          <nav className="space-y-1" aria-label="Tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={clsx(
                  'w-full flex items-center px-3 py-2 text-sm font-medium',
                  activeTab === id
                    ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Modal>
  );
};