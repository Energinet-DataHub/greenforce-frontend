import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  plugins: [angular(), nxViteTsPaths()],
  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test-setup.ts',
    include: ['src/**/*.spec.ts', 'tests/**/*.spec.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['html', 'json', 'text-summary'],
      reportsDirectory: '../../../../coverage/feature-metering-gridarea-imbalance',
    },
    pool: 'vmThreads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
