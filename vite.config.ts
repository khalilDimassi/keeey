import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Specify which Node.js modules to polyfill
      include: ['util', 'stream', 'crypto', 'assert', 'http', 'https', 'url', 'buffer', 'querystring'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    // Explicitly include problematic modules
    include: [],
  },
  define: {
    // Fix global variable issues
    'process.env': {},
    global: 'window',
  },
});