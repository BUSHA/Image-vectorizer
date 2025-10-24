import type { VectorizeOptions } from '../types';

export const vectorizeImage = (
  imageDataUrl: string,
  options: VectorizeOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.ImageTracer) {
      return reject(new Error('ImageTracer.js is not loaded.'));
    }

    try {
      // Create a copy of options to avoid mutation
      const tracerOptions = { ...options };

      window.ImageTracer.imageToSVG(
        imageDataUrl,
        (svgString: string) => {
          resolve(svgString);
        },
        tracerOptions
      );
    } catch (error) {
      reject(error);
    }
  });
};
