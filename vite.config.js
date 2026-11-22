import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In CI the sibling apps are checked out inside the workspace (SIBLING_APPS_DIR).
const siblingApps = process.env.SIBLING_APPS_DIR
  ? path.resolve(process.env.SIBLING_APPS_DIR)
  : path.resolve(__dirname, '..');

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      // Embed the real apps (live source) as demos.
      '@agrumi': path.join(siblingApps, 'agrumi-app/src'),
      '@rugby': path.join(siblingApps, 'rugby-app/src'),
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
