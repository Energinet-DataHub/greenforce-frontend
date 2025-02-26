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

export default defineConfig({
  e2e: {
    video: true,
    chromeWebSecurity: false,
    supportFile: `${__dirname}/src/support/e2e.ts`,
    specPattern: `${__dirname}/src/**/*.cy.ts`,
    excludeSpecPattern: `${__dirname}/src/e2e/b2c-healthchecks.cy.ts`,
    fixturesFolder: `${__dirname}/src/fixtures`,
    viewportWidth: 1280,
  },
});
