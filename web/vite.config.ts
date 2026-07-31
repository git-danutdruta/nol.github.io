import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * GitHub Pages SPA fallback plugin.
 *
 * GitHub Pages returns its own 404 for any deep path that has no matching
 * static file. For a client-routed SPA (React Router BrowserRouter), that
 * means visiting `/nol.github.io/subjects` directly or refreshing on any
 * inner page produces a 404 before our app can boot.
 *
 * Publishing `dist/404.html` as an exact copy of `dist/index.html` makes
 * GitHub Pages serve the SPA shell for any missing path, letting React
 * Router take over on the client.
 */
function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const indexPath = resolve(distDir, 'index.html');
      const notFoundPath = resolve(distDir, '404.html');
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, notFoundPath);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tsconfigPaths(), githubPagesSpaFallback()],
  base: '/nol.github.io/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          i18n: [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector',
            'i18next-http-backend',
          ],
          state: ['zustand'],
        },
      },
    },
  },
});
