import React from 'react';

export const GeneralTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700">Page URL</h3>
        <div className="mt-2 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            linkhub.com/
          </span>
          <input
            type="text"
            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="username"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700">SEO</h3>
        <div className="mt-2 space-y-4">
          <div>
            <label htmlFor="metaTitle" className="block text-sm text-gray-500">
              Meta Title
            </label>
            <input
              type="text"
              id="metaTitle"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="metaDescription" className="block text-sm text-gray-500">
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700">Privacy</h3>
        <div className="mt-2 space-y-4">
          <div className="flex items-center">
            <input
              id="private"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="private" className="ml-2 text-sm text-gray-500">
              Make page private
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="noindex"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="noindex" className="ml-2 text-sm text-gray-500">
              Hide from search engines
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};