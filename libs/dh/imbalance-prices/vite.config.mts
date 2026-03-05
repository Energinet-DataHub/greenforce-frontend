/// <reference types='vitest' />
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/dh/imbalance-prices',
  plugins: [angular({ tsconfig: './tsconfig.json' }), nxViteTsPaths()],
  test: {
    passWithNoTests: true,
    globals: true,
    watch: false,
    environment: 'happy-dom',
    setupFiles: './tests/test-setup.ts',
    include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8' as const,
      reportsDirectory: '../../../coverage/libs/dh/imbalance-prices',
    },
    pool: 'forks',
    isolate: false,
    maxWorkers: 1,
  },
});
