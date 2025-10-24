
import React from 'react';

export const Loader: React.FC = () => (
  <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex flex-col items-center justify-center backdrop-blur-sm z-10">
    <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Vectorizing...</p>
  </div>
);
