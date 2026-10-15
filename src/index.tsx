import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import type { ContentSnapshot } from './content/types';
import { normalizeContent } from './content/api';
import './index.css';

declare global {
  interface Window {
    __PORTFOLIO_CONTENT__?: ContentSnapshot;
  }
}
async function start() {
  const root = document.getElementById('root')!;
  const snapshot =
    window.__PORTFOLIO_CONTENT__ ??
    normalizeContent(
      await (await fetch('/content-snapshot.json')).json(),
      'fixture',
    );
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
void start();
