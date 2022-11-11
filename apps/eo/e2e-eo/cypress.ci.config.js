/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { defineConfig } = require('cypress');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const {
  addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor');

const cypressJsonConfig = {
  chromeWebSecurity: false,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videoUploadOnPasses: false,
  videosFolder: '../../../dist/cypress/apps/eo/e2e-eo/videos',
  viewportHeight: 800,
  viewportWidth: 1280,
  screenshotsFolder: '../../../dist/cypress/apps/eo/e2e-eo/screenshots',
  specPattern: ['**/*.feature'],
  supportFile: 'src/support/e2e.ts',
};

async function setupNodeEvents(on, config) {
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
    ...cypressJsonConfig,
    setupNodeEvents,
  },
});
