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
import { mocks, onUnhandledRequest, handlers } from '@energinet-datahub/gf/util-msw';
import { setupServer } from 'msw/node';

export function setupMSWServer(apiBase: string, mocks: mocks) {
  const server = setupServer(...handlers(apiBase, mocks));

  beforeAll(() => {
    // Enable the mocking in tests.
    server.listen({ onUnhandledRequest });
  });

  afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers();
  });

  afterAll(() => {
    // Clean up once the tests are done.
    server.close();
  });
}
