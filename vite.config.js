import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as NodePolyfills from 'vite-plugin-node-polyfills';  // Corrected import

export default defineConfig({
  base: '/',
  plugins: [react(), NodePolyfills.default()],  // Use default() to invoke the plugin correctly
  define: {
    'process.env': {},
  },
});
