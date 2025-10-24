import React, { useState, useEffect, useCallback } from 'react';
import type { VectorizeOptions, Preset, Presets } from './types';
import { vectorizeImage } from './services/vectorizerService';
import { ControlPanel } from './components/ControlPanel';
import { ImageDropzone } from './components/ImageDropzone';
import { PreviewArea } from './components/PreviewArea';
import { ThemeToggle } from './components/ThemeToggle';

const initialOptions: VectorizeOptions = {
  // Tracing
  ltres: 1,
  qtres: 1,
  pathomit: 8,
  rightangleenhance: true,
  corsenabled: true,

  // Color Quantization
  colorsampling: 2, // 0: disabled, 1: random, 2: deterministic
  numberofcolors: 16,
  mincolorratio: 0,
  colorquantcycles: 3,
  
  // SVG rendering
  strokewidth: 1,
  linefilter: false,
  scale: 1,
  roundcoords: 1,
  viewbox: true,
  desc: false,
  lcpr: 0,
  qcpr: 0,

  // Blur
  blurradius: 0,
  blurdelta: 20,
};

const presets: Presets = {
  default: initialOptions,
  blackAndWhite: {
    ...initialOptions,
    numberofcolors: 2,
    colorsampling: 0,
    blurradius: 0,
  },
  illustration: {
    ...initialOptions,
    numberofcolors: 16,
    blurradius: 0.5,
    pathomit: 10,
  },
  detailed: {
    ...initialOptions,
    numberofcolors: 64,
    blurradius: 0,
    pathomit: 4,
    ltres: 0.5,
    qtres: 0.5,
    roundcoords: 2,
  },
};

function App() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<VectorizeOptions>(initialOptions);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>('default');

  const handleVectorize = useCallback(async () => {
    if (!sourceImage) return;
    
    setIsLoading(true);
    setError(null);
    setSvgContent(null);
    
    try {
      const svg = await vectorizeImage(sourceImage, options);
      setSvgContent(svg);
    } catch (err) {
      setError('Failed to vectorize image. Please try a different image or adjust settings.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [sourceImage, options]);

  useEffect(() => {
    handleVectorize();
  }, [handleVectorize]);

  const handleImageLoad = (dataUrl: string) => {
    setSourceImage(dataUrl);
  };

  const handleReset = () => {
    setSourceImage(null);
    setSvgContent(null);
    setOptions(initialOptions);
    setSelectedPreset('default');
    setError(null);
  };

  const handleOptionsChange = <K extends keyof VectorizeOptions>(
    key: K,
    value: VectorizeOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
    setSelectedPreset('custom');
  };
  
  const handlePresetChange = (presetName: Exclude<Preset, 'custom'>) => {
    setSelectedPreset(presetName);
    setOptions(presets[presetName]);
  };


  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
          Image vectorizer
        </h1>
        <ThemeToggle />
      </header>

      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!sourceImage ? (
              <ImageDropzone onImageLoad={handleImageLoad} />
            ) : (
              <PreviewArea
                sourceImage={sourceImage}
                svgContent={svgContent}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <ControlPanel
              options={options}
              onOptionChange={handleOptionsChange}
              onReset={handleReset}
              svgContent={svgContent}
              isImageLoaded={!!sourceImage}
              presets={presets}
              selectedPreset={selectedPreset}
              onPresetChange={handlePresetChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
