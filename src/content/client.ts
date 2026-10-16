import type { ContentSnapshot } from './types';

type ContentApi = Pick<
  typeof import('./api'),
  'normalizeContent' | 'refreshContent'
>;
type LoadContentApi = () => Promise<ContentApi>;
const loadContentApi: LoadContentApi = () => import('./api');

export async function initialClientContent(
  snapshot?: ContentSnapshot,
  fetcher: typeof fetch = fetch,
  loadApi: LoadContentApi = loadContentApi,
): Promise<ContentSnapshot> {
  if (snapshot) return snapshot;
  const [api, response] = await Promise.all([
    loadApi(),
    fetcher('/content-snapshot.json'),
  ]);
  if (!response.ok)
    throw new Error(`Content snapshot unavailable (${response.status}).`);
  return api.normalizeContent(await response.json(), 'fixture');
}

export async function refreshClientContent(
  snapshot: ContentSnapshot,
  loadApi: LoadContentApi = loadContentApi,
): Promise<ContentSnapshot> {
  if (!snapshot.cms) return snapshot;
  try {
    return await (await loadApi()).refreshContent(snapshot);
  } catch {
    // A failed chunk download must preserve the same fallback as a failed query.
    return snapshot;
  }
}
