import { PlaywrightTestConfig } from '@playwright/test';

// We use named export to beeing able to extend the config in other config files
export const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./global-setup'),
  // This is required to be able to use custom tsconfig
  testDir: '../../../dist/out-tsc/apps/dh/e2e-dh',
  use: {
    headless: false,
    baseURL: 'https://localhost:4200/',
    ignoreHTTPSErrors: true,
    // Tell all tests to load signed-in state from 'playwright-storage-state.json'.
    storageState: 'apps/dh/e2e-dh/playwright-storage-state.json',
  },
};

// Default export is needed for Playwright to load the config.
export default config;
