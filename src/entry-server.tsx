import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import type { ContentSnapshot } from './content/types';
export {
  fetchPublishedContent,
  normalizeContent,
  validateProject,
  listProjects,
  getProject,
  refreshContent,
  PUBLISHED_QUERY,
  sanityQueryUrl,
  safeUrl,
} from './content/api';
export {
  pageMetadata,
  metadataHtml,
  serializeSnapshot,
  escapeHtml,
  SITE_URL,
} from './content/metadata';
export function render(path: string, snapshot: ContentSnapshot): string {
  return renderToString(
    <StaticRouter location={path}>
      <App initialSnapshot={snapshot} />
    </StaticRouter>,
  );
}
