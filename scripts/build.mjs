import { spawnSync } from 'node:child_process';
for (const args of [
  ['node_modules/typescript/bin/tsc', '--noEmit'],
  ['node_modules/vite/bin/vite.js', 'build', '--outDir', 'build/client'],
  [
    'node_modules/vite/bin/vite.js',
    'build',
    '--ssr',
    'src/entry-server.tsx',
    '--outDir',
    'build/server',
  ],
  ['scripts/prerender.mjs'],
]) {
  const result = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
