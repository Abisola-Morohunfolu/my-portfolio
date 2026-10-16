import { createServer } from 'node:http';
import { stat, readFile, realpath } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { brotliCompress, gzip } from 'node:zlib';
const compressors = { br: promisify(brotliCompress), gzip: promisify(gzip) };
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
function encodingFor(header, compressible) {
  const accepted = new Map(
    (header ?? '')
      .toLowerCase()
      .split(',')
      .filter(Boolean)
      .map((entry) => {
        const [name, ...params] = entry.trim().split(';');
        const quality = params.find((param) => param.trim().startsWith('q='));
        const q = quality ? Number(quality.trim().slice(2)) : 1;
        return [name.trim(), Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0];
      }),
  );
  const candidates = compressible ? ['br', 'gzip'] : [];
  const options = candidates.map((name) => ({
    name,
    q: accepted.get(name) ?? accepted.get('*') ?? 0,
  }));
  const best = options.filter(({ q }) => q > 0).sort((a, b) => b.q - a.q)[0];
  const identityQuality =
    accepted.get('identity') ?? (accepted.get('*') === 0 ? 0 : 1);
  if (best && !(accepted.has('identity') && identityQuality > best.q))
    return best.name;
  return identityQuality > 0 ? 'identity' : undefined;
}

export function createPreviewServer(directory = 'build/client') {
  const root = resolve(directory);
  const withinRoot = (file) => file === root || file.startsWith(root + sep);
  return createServer(async (req, res) => {
    try {
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
      }
      let pathname;
      try {
        pathname = decodeURIComponent(
          new URL(req.url ?? '/', 'http://localhost').pathname,
        );
      } catch {
        res.writeHead(400).end();
        return;
      }
      let file = resolve(root, `.${pathname}`);
      if (!withinRoot(file) || pathname.includes('\0')) {
        res.writeHead(400).end();
        return;
      }
      let status = 200;
      try {
        if ((await stat(file)).isDirectory())
          file = resolve(file, 'index.html');
        await stat(file);
      } catch {
        file = resolve(root, '404.html');
        status = 404;
      }
      if (!withinRoot(await realpath(file))) {
        res.writeHead(400).end();
        return;
      }
      const contentType = mime[extname(file)] ?? 'application/octet-stream';
      const compressible =
        /^(text\/|application\/(json|xml)|image\/svg\+xml)/.test(contentType);
      const encoding = encodingFor(
        req.headers['accept-encoding'],
        compressible,
      );
      if (!encoding) {
        res.writeHead(406, { Vary: 'Accept-Encoding' }).end();
        return;
      }
      const content = await readFile(file);
      const body =
        encoding === 'identity'
          ? content
          : await compressors[encoding](content);
      const hashedAsset =
        status === 200 &&
        file.startsWith(resolve(root, 'assets') + sep) &&
        /-[A-Za-z0-9_-]{8,}\.[^.]+$/.test(file);
      res.writeHead(status, {
        'Content-Type': contentType,
        'Cache-Control': hashedAsset
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=0, must-revalidate',
        Vary: 'Accept-Encoding',
        'Content-Length': body.length,
        ...(encoding !== 'identity' ? { 'Content-Encoding': encoding } : {}),
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res
        .writeHead(500)
        .end(
          req.method === 'HEAD'
            ? undefined
            : 'Preview unavailable. Run npm run build first.',
        );
    }
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const port = Number(process.env.PORT ?? 4173);
  createPreviewServer().listen(port, '127.0.0.1', () =>
    console.log(`Local: http://127.0.0.1:${port}`),
  );
}
