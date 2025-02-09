import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      path: 'path-browserify',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  define: {
    global: 'window',
  },
});
