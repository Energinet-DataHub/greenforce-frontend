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
import { vi } from 'vitest';
import { configure } from '@testing-library/dom';

import { setUpTestbed, setUpAngularTestingLibrary } from '@energinet-datahub/gf/test-util-staging';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';

// Make vi available globally
(globalThis as typeof globalThis & { vi: typeof vi }).vi = vi;

// Disable better query suggestions for this test suite
configure({
  throwSuggestions: false,
  getElementError: (message) => {
    const error = new Error(message ?? '');
    error.name = 'TestingLibraryElementError';
    Error.captureStackTrace(error, configure);
    return error;
  },
});

addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
