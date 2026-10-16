import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import type { ContentSnapshot } from './content/types';
import { initialClientContent } from './content/client';
import './index.css';

declare global {
  interface Window {
    __PORTFOLIO_CONTENT__?: ContentSnapshot;
  }
}
async function start() {
  const root = document.getElementById('root')!;
  const snapshot = await initialClientContent(window.__PORTFOLIO_CONTENT__);
  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <App initialSnapshot={snapshot} />
      </BrowserRouter>
    </React.StrictMode>
  );
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
void start().catch(() => {
  const root = document.getElementById('root');
  // Keep useful prerendered HTML if startup cannot download the content module.
  if (!root || root.hasChildNodes()) return;
  const message = document.createElement('p');
  message.setAttribute('role', 'alert');
  message.textContent = 'The portfolio could not load. ';
  const retry = document.createElement('a');
  retry.href = window.location.href;
  retry.textContent = 'Reload the page';
  message.append(retry);
  root.append(message);
});
