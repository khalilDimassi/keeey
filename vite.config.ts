import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        // Add frequently used files
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/home.tsx',
        './src/pages/components/Navbar.tsx',
        './src/pages/components/sidebar.tsx',
        './src/pages/components/BaseLayout.tsx',
        './src/pages/components/SVGcomponents.tsx',
      ],
    },
  },
  optimizeDeps: {
    // Add other large dependencies
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ],
    // Exclude problematic packages if needed
    exclude: [],
  },
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
  define: {
    // Fix global variable issues
    'process.env': {},
    global: 'window',
  },
});