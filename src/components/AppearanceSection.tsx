import React from 'react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Poppins',
  'Montserrat'
];

const buttonStyles = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'pill', label: 'Pill' },
  { value: 'square', label: 'Square' }
];

export const AppearanceSection: React.FC = () => {
  const { theme, updateTheme } = useStore();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Appearance Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                id="backgroundColor"
                value={theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="h-10 w-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700">
              Button Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                id="buttonColor"
                value={theme.buttonColor}
                onChange={(e) => updateTheme({ buttonColor: e.target.value })}
                className="h-10 w-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={theme.buttonColor}
                onChange={(e) => updateTheme({ buttonColor: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">
              Text Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                id="textColor"
                value={theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="h-10 w-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
              Font Family
            </label>
            <select
              id="fontFamily"
              value={theme.fontFamily}
              onChange={(e) => updateTheme({ fontFamily: e.target.value })}
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {buttonStyles.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateTheme({ buttonStyle: value as any })}
                  className={clsx(
                    'py-3 px-4 text-sm font-medium rounded-lg border-2 transition-colors',
                    theme.buttonStyle === value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};