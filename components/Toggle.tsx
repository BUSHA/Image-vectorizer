import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  tooltip?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, disabled, tooltip }) => {
  const toggleId = React.useId();
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} title={tooltip}>
      <label htmlFor={toggleId} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
        {label}
      </label>
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
