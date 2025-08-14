/// <reference types='vitest' />
import { defineConfig } from 'vite';

import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/dh/imbalance-prices/data-access-api',

  plugins: [
    viteTsConfigPaths({
      root: '../../../../',
    }),
  ],

  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/dh/imbalance-prices/data-access-api',
      provider: 'v8',
    },
  },
}));
