
import React, from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  tooltip?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min, max, step, disabled, tooltip }) => {
  return (
    <div className={`space-y-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex justify-between items-center" title={tooltip}>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110"
      />
    </div>
  );
};
