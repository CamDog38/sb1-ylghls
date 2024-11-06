import React from 'react';
import { BarChart2, TrendingUp, Users } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Analytics Overview</h2>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-900">Total Visitors</h3>
                <p className="mt-1 text-2xl font-semibold text-indigo-600">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-900">Total Clicks</h3>
                <p className="mt-1 text-2xl font-semibold text-indigo-600">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-900">CTR</h3>
                <p className="mt-1 text-2xl font-semibold text-indigo-600">0%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Coming Soon</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Detailed analytics features will be available in a future update.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};