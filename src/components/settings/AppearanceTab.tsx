import React from 'react';
import { useStore } from '../../store/useStore';

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

export const AppearanceTab: React.FC = () => {
  const { theme, updateTheme } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
          Background Color
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            id="backgroundColor"
            value={theme.backgroundColor}
            onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
            className="h-8 w-8 rounded-md border border-gray-300"
          />
          <input
            type="text"
            value={theme.backgroundColor}
            onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700">
          Button Color
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            id="buttonColor"
            value={theme.buttonColor}
            onChange={(e) => updateTheme({ buttonColor: e.target.value })}
            className="h-8 w-8 rounded-md border border-gray-300"
          />
          <input
            type="text"
            value={theme.buttonColor}
            onChange={(e) => updateTheme({ buttonColor: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">
          Text Color
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            id="textColor"
            value={theme.textColor}
            onChange={(e) => updateTheme({ textColor: e.target.value })}
            className="h-8 w-8 rounded-md border border-gray-300"
          />
          <input
            type="text"
            value={theme.textColor}
            onChange={(e) => updateTheme({ textColor: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {fontOptions.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Button Style
        </label>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {buttonStyles.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateTheme({ buttonStyle: value as any })}
              className={`
                border rounded-md py-2 px-3 flex items-center justify-center text-sm font-medium
                ${theme.buttonStyle === value
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};