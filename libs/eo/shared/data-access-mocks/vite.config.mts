/// <reference types='vitest' />
import { defineConfig } from 'vite';
import analog from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../node_modules/.vite/libs/eo/shared/data-access-mocks',
  plugins: [analog(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/eo/shared/data-access-mocks',
      provider: 'v8',
    },
  },
  define: {
    'import.meta.vitest': undefined,
  },
}));