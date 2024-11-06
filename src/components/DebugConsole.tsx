import React, { useState, useEffect } from 'react';
import { Terminal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';

export const DebugConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const store = useStore();
  const [logs, setLogs] = useState<{ timestamp: Date; message: string; type: 'log' | 'error' | 'warn' }[]>([]);

  // Override console methods to capture logs
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn
    };

    console.log = (...args) => {
      originalConsole.log(...args);
      setLogs(prev => [...prev, { timestamp: new Date(), message: args.join(' '), type: 'log' }]);
    };

    console.error = (...args) => {
      originalConsole.error(...args);
      setLogs(prev => [...prev, { timestamp: new Date(), message: args.join(' '), type: 'error' }]);
    };

    console.warn = (...args) => {
      originalConsole.warn(...args);
      setLogs(prev => [...prev, { timestamp: new Date(), message: args.join(' '), type: 'warn' }]);
    };

    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
    };
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
      >
        <Terminal className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className={`fixed right-4 bg-gray-800 text-white rounded-lg shadow-xl transition-all duration-200 ${isMinimized ? 'h-12' : 'h-96'}`} style={{ bottom: '1rem', width: '500px' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          <span className="font-medium">Debug Console</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 space-y-4 h-[calc(100%-3rem)] overflow-auto">
          {/* Store State */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Store State:</h3>
            <pre className="text-xs bg-gray-900 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(store, null, 2)}
            </pre>
          </div>

          {/* Console Logs */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Console Logs:</h3>
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`text-xs p-2 rounded ${
                    log.type === 'error' ? 'bg-red-900/50 text-red-200' :
                    log.type === 'warn' ? 'bg-yellow-900/50 text-yellow-200' :
                    'bg-gray-900'
                  }`}
                >
                  <span className="text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  {' '}
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};