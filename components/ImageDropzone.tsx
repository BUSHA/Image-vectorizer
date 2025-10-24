
import React, { useCallback, useRef, useState } from 'react';
import { UploadIcon } from './Icon';

interface ImageDropzoneProps {
  onImageLoad: (dataUrl: string) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onImageLoad(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageLoad]);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  }, [processFile]);
  
  React.useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [processFile]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFile(event.target.files[0]);
    }
  };

  const dropzoneClasses = `
    flex flex-col items-center justify-center 
    w-full h-[60vh] max-h-[600px] 
    border-2 border-dashed rounded-xl 
    cursor-pointer transition-colors duration-300
    ${isDragging 
      ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20' 
      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
  `;

  return (
    <div
      className={dropzoneClasses}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center text-gray-500 dark:text-gray-400">
        <UploadIcon className="w-12 h-12 mb-4" />
        <p className="mb-2 text-lg md:text-xl font-semibold">
          <span className="text-blue-500">Paste</span>, click, or drop file
        </p>
        <p className="text-sm">PNG, JPG, GIF, etc.</p>
      </div>
    </div>
  );
};
