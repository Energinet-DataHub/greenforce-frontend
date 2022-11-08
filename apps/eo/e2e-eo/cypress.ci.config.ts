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
  specPattern: ['**/*.feature'],
  supportFile: 'src/support/e2e.ts',
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
  },
});
