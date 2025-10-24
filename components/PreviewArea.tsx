
import React, { useState, useRef } from 'react';
import { Loader } from './Loader';
import { ZoomInIcon, ZoomOutIcon, ZoomResetIcon } from './Icon';

interface PreviewAreaProps {
  sourceImage: string;
  svgContent: string | null;
  isLoading: boolean;
  error: string | null;
}

type ViewMode = 'vector' | 'original';

export const PreviewArea: React.FC<PreviewAreaProps> = ({ sourceImage, svgContent, isLoading, error }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('vector');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (newZoomLevel: number, mouseX: number, mouseY: number) => {
    const clampedZoom = Math.max(0.1, Math.min(newZoomLevel, 10));

    const pointX = (mouseX - pan.x) / zoom;
    const pointY = (mouseY - pan.y) / zoom;

    const newPanX = mouseX - pointX * clampedZoom;
    const newPanY = mouseY - pointY * clampedZoom;

    setZoom(clampedZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleZoomIn = () => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    handleZoom(zoom * 1.3, width / 2, height / 2);
  };
  
  const handleZoomOut = () => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    handleZoom(zoom / 1.3, width / 2, height / 2);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    
    const scaleAmount = 1.1;
    const newZoom = e.deltaY > 0 ? zoom / scaleAmount : zoom * scaleAmount;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    handleZoom(newZoom, mouseX, mouseY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };
  
  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  const renderInnerContent = () => {
    if (isLoading || error) return null;
    if (!sourceImage) return null;

    if (viewMode === 'vector' && svgContent) {
      return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svgContent }} />;
    }
    
    return <img src={sourceImage} alt="Original" className="max-w-full max-h-full object-contain" />;
  };
  
  const getButtonClass = (mode: ViewMode) => 
    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      viewMode === mode
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center z-10">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" className={`${getButtonClass('vector')} rounded-l-lg`} onClick={() => setViewMode('vector')} disabled={!svgContent}>Vector</button>
          <button type="button" className={`${getButtonClass('original')} rounded-r-lg`} onClick={() => setViewMode('original')}>Original</button>
        </div>
        <div className="flex items-center space-x-1">
          <button title="Zoom Out" onClick={handleZoomOut} className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ZoomOutIcon className="w-5 h-5" />
          </button>
          <button title="Reset Zoom" onClick={handleReset} className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ZoomResetIcon className="w-5 h-5" />
          </button>
          <button title="Zoom In" onClick={handleZoomIn} className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ZoomInIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div 
        ref={containerRef}
        className="relative flex-grow min-h-[300px] h-[60vh] max-h-[600px] overflow-hidden bg-gray-100 dark:bg-gray-800"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {isLoading ? <Loader /> : error ? <div className="text-red-500 p-4">{error}</div> : (
          <div 
            className="w-full h-full p-4 flex items-center justify-center transition-transform duration-100"
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {renderInnerContent()}
          </div>
        )}
      </div>
    </div>
  );
};
