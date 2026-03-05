/// <reference types='vitest' />
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/dh/market-participant/ui-shared',
  plugins: [angular({ tsconfig: './tsconfig.json' }), nxViteTsPaths()],
  test: {
    passWithNoTests: true,
    watch: false,
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/test-setup.ts',
    include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
    coverage: {
      reportsDirectory: '../../../../coverage/ui-shared',
      provider: 'v8' as const,
    },
    pool: 'forks',
    isolate: false,
    maxWorkers: 1,
    server: {
      deps: {
        inline: [/fesm2022/],
      },
    },
  },
});
