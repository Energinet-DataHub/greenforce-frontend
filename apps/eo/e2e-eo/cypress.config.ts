import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const {
  addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor');

const cypressJsonConfig = {
  chromeWebSecurity: false,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../../dist/cypress/apps/eo/e2e-eo/videos',
  viewportHeight: 1080,
  viewportWidth: 1920,
  screenshotsFolder: '../../../dist/cypress/apps/eo/e2e-eo/screenshots',
  specPattern: ['**/*.feature'],
  supportFile: 'src/support/e2e.ts',
};

async function setupNodeEvents(on: any, config: any) {
  await addCucumberPreprocessorPlugin(on, config);

  const options = {
    webpackOptions: {
      module: {
        rules: [
          {
            test: /\.feature$/,
            use: [
              {
                loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                options: config,
              },
            ],
          },
        ],
      },
    },
  };

  on('file:preprocessor', webpackPreprocessor(options));

  return config;
}

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
    setupNodeEvents,
  },
});
