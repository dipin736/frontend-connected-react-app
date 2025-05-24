import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    nodePolyfills({
      // Specify which polyfills you need
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    })
  ],
  define: {
    'process.env': {},
  },
  build: {
    target: 'esnext' // Helps with modern browser support
  }
});
