import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@fontsource-variable/inter';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';

// Only register service worker in supported environments
const isUnsupportedEnvironment = 
  window.location.hostname.includes('stackblitz') || 
  window.location.hostname.includes('webcontainer');

if (!isUnsupportedEnvironment) {
  // Register service worker for PWA functionality
  registerServiceWorker();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);