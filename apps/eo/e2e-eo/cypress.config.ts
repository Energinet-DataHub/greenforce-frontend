import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

const cypressJsonConfig = {
  chromeWebSecurity: false,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../../dist/cypress/apps/eo/e2e-eo/videos',
  viewportHeight: 1080,
  viewportWidth: 1920,
  screenshotsFolder: '../../../dist/cypress/apps/eo/e2e-eo/screenshots',
  specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
  },
});
