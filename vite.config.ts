import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Image-vectorizer/', // Enables correct asset paths for GitHub Pages
  plugins: [react()],
});