import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('build/client');
const port = Number(process.env.PORT ?? 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url ?? '/', 'http://localhost').pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(400).end();
      return;
    }
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      await stat(file);
    } catch {
      file = resolve(root, '404.html');
      status = 404;
    }
    res.writeHead(status, {
      'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(500).end('Preview unavailable. Run npm run build first.');
  }
}).listen(port, '127.0.0.1', () =>
  console.log(`Local: http://127.0.0.1:${port}`),
);
