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
import '@analogjs/vitest-angular/setup-zone';
import '@angular/compiler';
import '@testing-library/jest-dom/vitest';
import '@energinet-datahub/gf/test-util-vitest'; // Import MSW polyfills

import { setUpTestbed, setUpAngularTestingLibrary } from '@energinet-datahub/gf/test-util-staging';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';

import { setupServer, SetupServerApi } from 'msw/node';
import {
  onUnhandledRequest,
  handlers,
} from '@energinet-datahub/gf/msw/test-util-msw-setup';
import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';
import { mocks } from '@energinet-datahub/dh/shared/test-util-mocks';

declare global {
  // eslint-disable-next-line no-var
  var __mswServer: SetupServerApi;
}

const server = setupServer(...handlers(dhLocalApiEnvironment.apiBase, mocks));
globalThis.__mswServer = server;

beforeAll(() => server.listen({ onUnhandledRequest }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
