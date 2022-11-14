import { defineConfig } from 'cypress';
import preprocessor from '@cypress/webpack-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);
  on(
    'file:preprocessor',
    preprocessor({
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                },
              ],
            },
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
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  e2e: {
    specPattern: '**/*.feature',
    supportFile: false,
    chromeWebSecurity: false,
    fileServerFolder: '.',
    fixturesFolder: './src/fixtures',
    video: false,
    videoUploadOnPasses: false,
    videosFolder: 'dist/cypress/apps/eo/e2e-eo/videos',
    viewportHeight: 800,
    viewportWidth: 1280,
    screenshotsFolder: 'dist/cypress/apps/eo/e2e-eo/screenshots',
    setupNodeEvents,
  },
});
