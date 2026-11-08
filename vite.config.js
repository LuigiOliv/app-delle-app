import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      // Embed the real apps (live source) as demos.
      '@agrumi': path.resolve(__dirname, '../agrumi-app/src'),
      '@rugby': path.resolve(__dirname, '../rugby-app/src'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,  // Include tutti i file .js/.jsx
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 5171,  // ⚠️ Mantieni porte diverse tra progetti
    strictPort: false,
    host: '0.0.0.0',
    fs: {
      // Allow importing sibling app sources (../agrumi-app, ../rugby-app)
      allow: [path.resolve(__dirname, '..')],
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
    // Make cross-origin isolation headers opt-in (set CROSS_ORIGIN_ISOLATION=true when needed)
    headers: process.env.CROSS_ORIGIN_ISOLATION === 'true'
      ? {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      }
      : undefined,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
