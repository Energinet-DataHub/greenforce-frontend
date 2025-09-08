//#region License
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
//#endregion
import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import type { Plugin as EsbuildPlugin } from 'esbuild';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname, { bundler: 'vite' }),
    chromeWebSecurity: false,
    specPattern: '**/*.feature',
    supportFile: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    video: true,
    stepDefinitions: ['apps/eo/e2e-eo-landing-page/src/**/*.ts'],

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      const cucumberPlugin = createEsbuildPlugin(config) as unknown as EsbuildPlugin;

      const bundler = createBundler({
        plugins: [cucumberPlugin],
      });

      on('file:preprocessor', bundler);
      return config;
    },
  },
});
