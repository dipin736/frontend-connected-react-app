import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import NodePolyfills from 'vite-plugin-node-polyfills';
export default defineConfig({
  base: '/',
  plugins: [react(), NodePolyfills()],
  define: {
    'process.env': {},
  },
});
