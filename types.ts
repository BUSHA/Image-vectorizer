export interface VectorizeOptions {
  // Tracing options
  corsenabled: boolean;
  ltres: number;
  qtres: number;
  pathomit: number;
  rightangleenhance: boolean;

  // Color quantization options
  colorsampling: 0 | 1 | 2;
  numberofcolors: number;
  mincolorratio: number;
  colorquantcycles: number;

  // SVG rendering options
  strokewidth: number;
  linefilter: boolean;
  scale: number;
  roundcoords: number;
  viewbox: boolean;
  desc: boolean;
  lcpr: number;
  qcpr: number;
  
  // Blur
  blurradius: number;
  blurdelta: number;
}

export type Preset = 'default' | 'blackAndWhite' | 'illustration' | 'detailed' | 'custom';

export type Presets = Record<Exclude<Preset, 'custom'>, VectorizeOptions>;

// Extend the Window interface to include ImageTracer from the CDN script
declare global {
  interface Window {
    ImageTracer: {
      imageToSVG: (
        url: string,
        callback: (svgString: string) => void,
        options: Partial<VectorizeOptions>
      ) => void;
      checkoptions: (options: Partial<VectorizeOptions>) => Partial<VectorizeOptions>;
    };
  }
}
