/// <reference types='vitest' />
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import viteTsConfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '../../');

export default defineConfig(() => ({
  cacheDir: resolve(workspaceRoot, 'node_modules/.vite/libs/dh'),

  plugins: [
    viteTsConfigPaths({
      root: workspaceRoot,
    }),
  ],

  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: [resolve(__dirname, 'test-setup.ts')],
    reporters: ['default'],
    coverage: {
      reportsDirectory: resolve(workspaceRoot, 'coverage/libs/dh'),
      provider: 'v8' as const,
    },
  },
}));
