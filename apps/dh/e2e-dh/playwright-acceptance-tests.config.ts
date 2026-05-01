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
import { defineConfig } from '@playwright/test';

import { baseE2EConfig } from './playwright.config';

// Acceptance tests run against a deployed environment. dh3-environments sets BASE_URL to the
// frontend URL of the target stage (dev_002, preprod, etc.). Tests authenticate via the same
// B2C tenant, then navigate inside the deployed app. No webServer here, since there is
// nothing to start locally.
const baseURL = process.env['BASE_URL'] ?? 'https://dev002.datahub3.dk';

export default defineConfig({
  ...baseE2EConfig,
  use: { ...baseE2EConfig.use, baseURL },
});
