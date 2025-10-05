import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Debug logging to track app initialization
console.log('🚀 PayShare app starting...', {
  timestamp: new Date().toISOString(),
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ Root element not found! Check that index.html has <div id="root"></div>');
  throw new Error('Root element not found');
}

console.log('✅ Root element found, rendering app...');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
