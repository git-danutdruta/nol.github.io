import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppRoutes } from '@/routes';
import { registerServiceWorker } from '@/lib/pwa/registerServiceWorker';
import '@/styles/index.css';
import '@/styles/transitions.css';
import '@/styles/print.css';

if (import.meta.env.PROD) {
  registerServiceWorker();
}

/**
 * Derive React Router basename from Vite's BASE_URL so that GitHub Pages
 * (deployed under `/nol.github.io/`) and local dev (`/`) both produce
 * correctly prefixed links. Without this, <Link to="/subjects"> renders
 * `/subjects` and drops the `/nol.github.io` path segment on click.
 */
const routerBasename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={routerBasename}>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
