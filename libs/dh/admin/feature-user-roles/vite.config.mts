import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: __dirname,
  plugins: [angular(), nxViteTsPaths()],
  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      provider: 'v8' as const,
      reporter: ['html', 'json', 'text-summary'],
      reportsDirectory: '../../../../coverage/feature-user-roles',
    },
    pool: 'forks',
  },
}));
