import React from 'react';
import { useStore } from '../store/useStore';
import { LinkPreviewCard } from './LinkPreviewCard';

export const MobilePreview: React.FC = () => {
  const links = useStore((state) => state.links);
  const profile = useStore((state) => state.profile);
  const theme = useStore((state) => state.theme);

  return (
    <div className="hidden lg:block fixed right-8 top-24 w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-900">
      {/* Phone Header */}
      <div className="relative bg-gray-900 h-6">
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full" />
      </div>

      {/* Content */}
      <div 
        className="h-[calc(100%-1.5rem)] overflow-y-auto"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily,
          color: theme.textColor
        }}
      >
        {/* Profile Section */}
        <div className="p-6 text-center">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
            />
          )}
          {profile.name && (
            <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
          )}
          {profile.bio && (
            <p className="text-sm opacity-75">{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="p-4 space-y-4">
          {links.map((item) => (
            <LinkPreviewCard 
              key={item.id} 
              item={item}
              theme={theme}
            />
          ))}
          
          {links.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No links yet. Add some links to see them here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Phone Footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-t-lg" />
    </div>
  );
};