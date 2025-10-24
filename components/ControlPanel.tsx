import React, { useState } from 'react';
import type { VectorizeOptions, Presets, Preset } from '../types';
import { Slider } from './Slider';
import { Button } from './Button';
import { CopyIcon, DownloadIcon, ResetIcon, SparklesIcon } from './Icon';
import { Toggle } from './Toggle';

interface ControlPanelProps {
  options: VectorizeOptions;
  onOptionChange: <K extends keyof VectorizeOptions>(key: K, value: VectorizeOptions[K]) => void;
  onReset: () => void;
  svgContent: string | null;
  isImageLoaded: boolean;
  presets: Presets;
  selectedPreset: Preset;
  onPresetChange: (preset: Exclude<Preset, 'custom'>) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, onOptionChange, onReset, svgContent, isImageLoaded, presets, selectedPreset, onPresetChange }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  const handleCopy = () => {
    if (svgContent) {
      navigator.clipboard.writeText(svgContent).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  
  const handleDownload = () => {
    if (svgContent) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vectorized-image.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  const handlePresetSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPresetChange(event.target.value as Exclude<Preset, 'custom'>);
  };

  const getTabClass = (tabName: 'basic' | 'advanced') => 
    `w-full py-2.5 text-sm font-medium leading-5 text-center rounded-lg focus:outline-none transition-colors ${
        activeTab === tabName 
            ? 'bg-blue-600 text-white shadow' 
            : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`;
    
  const samplingOptions = [
    { label: 'Off', value: 0 },
    { label: 'Random', value: 1 },
    { label: 'Deterministic', value: 2 },
  ] as const;

  const getSamplingButtonClass = (value: 0 | 1 | 2) => 
    `flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 disabled:opacity-50 ${
      options.colorsampling === value
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;
  
  return (
    <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-md space-y-6">
        <div className="flex items-center justify-between">
            <Button onClick={onReset} variant="secondary" size="sm" disabled={!isImageLoaded}>
                New image
            </Button>
        </div>

        <div className="space-y-2">
            <label htmlFor="presets" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Presets
            </label>
            <select
                id="presets"
                value={selectedPreset}
                onChange={handlePresetSelect}
                disabled={!isImageLoaded}
                className="w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
            >
                {selectedPreset === 'custom' && <option value="custom" disabled>Custom</option>}
                {(Object.keys(presets) as Array<keyof Presets>).map(presetName => (
                    <option key={presetName} value={presetName}>
                        {presetName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </option>
                ))}
            </select>
        </div>
        
        <div className="flex p-1 space-x-1 bg-gray-200 dark:bg-gray-900/50 rounded-xl">
            <button onClick={() => setActiveTab('basic')} className={getTabClass('basic')}>Basic</button>
            <button onClick={() => setActiveTab('advanced')} className={getTabClass('advanced')}>Advanced</button>
        </div>

        <div className="space-y-6">
        {activeTab === 'basic' && (
            <>
                <Slider
                    label="Detail level"
                    min={1} max={50} step={1}
                    value={51 - options.pathomit}
                    onChange={(val) => onOptionChange('pathomit', 51 - val)}
                    disabled={!isImageLoaded}
                    tooltip="Higher values mean more detail and more paths."
                />
                <Slider
                    label="Number of colors"
                    min={2} max={64} step={1}
                    value={options.numberofcolors}
                    onChange={(val) => onOptionChange('numberofcolors', val)}
                    disabled={!isImageLoaded}
                    tooltip="Reduces the image to this many colors."
                />
                <Slider
                    label="Blur"
                    min={0} max={5} step={0.1}
                    value={options.blurradius}
                    onChange={(val) => onOptionChange('blurradius', val)}
                    disabled={!isImageLoaded}
                    tooltip="Applies a blur before vectorizing to smooth edges."
                />
            </>
        )}
        
        {activeTab === 'advanced' && (
            <>
                <Slider
                    label="Line threshold"
                    min={0.1} max={5} step={0.1}
                    value={options.ltres}
                    onChange={(val) => onOptionChange('ltres', val)}
                    disabled={!isImageLoaded}
                    tooltip="Error threshold for straight lines."
                />
                 <Slider
                    label="Curve threshold"
                    min={0.1} max={5} step={0.1}
                    value={options.qtres}
                    onChange={(val) => onOptionChange('qtres', val)}
                    disabled={!isImageLoaded}
                    tooltip="Error threshold for quadratic splines."
                />
                 <Slider
                    label="Stroke width"
                    min={0} max={5} step={0.1}
                    value={options.strokewidth}
                    onChange={(val) => onOptionChange('strokewidth', val)}
                    disabled={!isImageLoaded}
                    tooltip="Width of the path strokes."
                />
                <Toggle
                    label="Enhance right angles"
                    checked={options.rightangleenhance}
                    onChange={(checked) => onOptionChange('rightangleenhance', checked)}
                    disabled={!isImageLoaded}
                    tooltip="Enhances right angles in the tracing."
                />
                <Slider
                    label="Coordinate precision"
                    min={0} max={8} step={1}
                    value={options.roundcoords}
                    onChange={(val) => onOptionChange('roundcoords', val)}
                    disabled={!isImageLoaded}
                    tooltip="Number of decimal places for coordinates. Fewer decimals means smaller file size."
                />
                <div className={`space-y-2 ${!isImageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Sampling</label>
                    <div className="flex space-x-1 rounded-md bg-gray-100 dark:bg-gray-900/50 p-1" role="group">
                        {samplingOptions.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onOptionChange('colorsampling', opt.value)}
                                disabled={!isImageLoaded}
                                className={getSamplingButtonClass(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </>
        )}
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
             <Button onClick={handleDownload} disabled={!svgContent}>
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download SVG
            </Button>
            <Button onClick={handleCopy} disabled={!svgContent} variant="secondary">
                <CopyIcon className="w-5 h-5 mr-2" />
                {copied ? 'Copied!' : 'Copy SVG'}
            </Button>
        </div>
    </div>
  );
};
