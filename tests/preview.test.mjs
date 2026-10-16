import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  writeFile,
  rm,
  symlink,
  realpath,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { request } from 'node:http';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { createPreviewServer } from '../scripts/preview.mjs';

await test('production preview serves compressed routes with safe caching and containment', async (t) => {
  const temp = await realpath(
    await mkdtemp(join(tmpdir(), 'portfolio-preview-')),
  );
  const root = join(temp, 'site');
  await mkdir(join(root, 'projects', 'example'), { recursive: true });
  await mkdir(join(root, 'assets'));
  const home = '<h1>Portfolio</h1>'.repeat(100);
  for (const [file, body] of Object.entries({
    'index.html': home,
    'projects/example/index.html': '<h1>Example</h1>',
    '404.html': '<h1>Not found</h1>',
    'assets/index-12345678.js': 'console.log("portfolio");',
    'assets/plain.js': '// unversioned',
    'content-snapshot.json': '{"projects":[]}',
    'image.jpg': 'jpeg',
    'image.webp': 'webp',
    'image.avif': 'avif',
  }))
    await writeFile(join(root, file), body);
  await writeFile(join(temp, 'outside.txt'), 'private');
  await symlink(join(temp, 'outside.txt'), join(root, 'escape.txt'));
  const server = createPreviewServer(root);
  t.after(async () => {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await rm(temp, { recursive: true, force: true });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const get = (path, encoding, method = 'GET') =>
    new Promise((resolve, reject) => {
      const req = request(
        {
          hostname: '127.0.0.1',
          port: server.address().port,
          path,
          method,
          headers:
            encoding === undefined ? {} : { 'Accept-Encoding': encoding },
        },
        (res) => {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () =>
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: Buffer.concat(chunks),
            }),
          );
        },
      );
      req.on('error', reject);
      req.end();
    });

  for (const [header, expected] of [
    ['gzip, br', 'br'],
    ['br;q=0, gzip;q=0.8', 'gzip'],
    ['*;q=0.5', 'br'],
    ['br;q=0.5, identity;q=1', undefined],
    ['br;q=0, gzip;q=0', undefined],
    [undefined, undefined],
    ['identity', undefined],
  ]) {
    const response = await get('/', header);
    assert.equal(response.status, 200);
    assert.equal(response.headers['content-encoding'], expected);
    assert.equal(response.headers.vary, 'Accept-Encoding');
    const body =
      expected === 'br'
        ? brotliDecompressSync(response.body)
        : expected === 'gzip'
          ? gunzipSync(response.body)
          : response.body;
    assert.equal(body.toString(), home);
    assert.equal(
      Number(response.headers['content-length']),
      response.body.length,
    );
  }
  assert.equal((await get('/', 'br;q=0,gzip;q=0,identity;q=0')).status, 406);
  const head = await get('/', 'br', 'HEAD');
  const compressed = await get('/', 'br');
  assert.equal(head.body.length, 0);
  assert.equal(
    head.headers['content-length'],
    compressed.headers['content-length'],
  );
  assert.equal(head.headers['content-encoding'], 'br');
  assert.equal(
    (await get('/projects/example')).body.toString(),
    '<h1>Example</h1>',
  );
  assert.equal((await get('/projects/example/')).status, 200);
  const missing = await get('/unknown', 'gzip');
  assert.equal(missing.status, 404);
  assert.equal(gunzipSync(missing.body).toString(), '<h1>Not found</h1>');
  assert.equal((await get('/unknown', 'br', 'HEAD')).body.length, 0);
  assert.equal(
    (await get('/assets/index-12345678.js')).headers['cache-control'],
    'public, max-age=31536000, immutable',
  );
  for (const path of [
    '/',
    '/content-snapshot.json',
    '/assets/plain.js',
    '/unknown',
  ]) {
    assert.equal(
      (await get(path)).headers['cache-control'],
      'public, max-age=0, must-revalidate',
    );
  }
  for (const [extension, type] of [
    ['jpg', 'jpeg'],
    ['webp', 'webp'],
    ['avif', 'avif'],
  ]) {
    const response = await get(`/image.${extension}`, 'br,gzip');
    assert.equal(response.headers['content-type'], `image/${type}`);
    assert.equal(response.headers['content-encoding'], undefined);
  }
  for (const path of ['/..%2foutside.txt', '/escape.txt', '/%ZZ', '/%00']) {
    assert.equal((await get(path)).status, 400, path);
  }
  assert.equal((await get('/', undefined, 'POST')).status, 405);
});
