/// <reference types='vitest' />
import { defineConfig } from 'vite';
import analog from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({ mode }) => {
  return {
    cacheDir: '../../../../node_modules/.vite/libs/dh/shared/feature-microsoft-clarity',
    plugins: [
      analog({
        vite: {
          inlineStylesExtension: 'scss',
        },
      }),
      nxViteTsPaths(),
    ],
    test: {
      globals: true,
      cache: { dir: '../../../../node_modules/.vitest' },
      environment: 'happy-dom',
      include: ['src/**/*.spec.ts'],
      setupFiles: ['src/test-setup.ts'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../../../coverage/libs/dh/shared/feature-microsoft-clarity',
        provider: 'v8',
      },
    },
  };
});
