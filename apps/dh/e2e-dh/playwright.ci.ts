import { PlaywrightTestConfig } from '@playwright/test';
import { config as baseConfig } from './playwright';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  use: {
    ...baseConfig.use,
    headless: true,
  },
};
export default config;
