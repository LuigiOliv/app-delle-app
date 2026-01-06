import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/',
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
