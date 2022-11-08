import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

const cypressJsonConfig = {
  chromeWebSecurity: false,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  screenshotsFolder: '../../../dist/cypress/apps/eo/e2e-eo/screenshots',
  video: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
  },
});
