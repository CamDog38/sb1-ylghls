import React, { useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import clsx from 'clsx';

export const ProfileTab: React.FC = () => {
  const { profile, updateProfile } = useStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [updateProfile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024 // 2MB
  });

  return (
    <div className="space-y-6 px-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center space-x-6">
          <div className="relative">
            {profile.avatar ? (
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-white"
                />
                <button
                  onClick={() => updateProfile({ avatar: undefined })}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={clsx(
                  'h-24 w-24 rounded-full flex items-center justify-center',
                  'border-2 border-dashed cursor-pointer transition-colors',
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          
          {!profile.avatar && (
            <div className="text-sm text-gray-500">
              <p>Drag and drop an image here, or click to select</p>
              <p className="mt-1">JPG, PNG or GIF (max. 2MB)</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Tell your story..."
        />
      </div>
    </div>
  );
};