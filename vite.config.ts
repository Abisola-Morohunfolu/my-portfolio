import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), svgr()],
  build: {
    outDir: 'build/client',
    rollupOptions: {
      output: {
        entryFileNames: isSsrBuild ? '[name].mjs' : 'assets/[name]-[hash].js',
      },
    },
  },
  server: { open: false },
}));
