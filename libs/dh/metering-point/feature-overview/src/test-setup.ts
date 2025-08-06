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
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

import { setUpTestbed, setUpAngularTestingLibrary } from '@energinet-datahub/gf/test-util-staging';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';
import { setupMSWServer } from '@energinet-datahub/gf/test-util-msw';
import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';
import { mocks } from '@energinet-datahub/dh/shared/data-access-mocks';

setupZoneTestEnv();

// Polyfill for BroadcastChannel required by MSW
if (typeof BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class BroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onmessageerror: ((event: MessageEvent) => void) | null = null;

    constructor(name: string) {
      this.name = name;
    }

    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent(): boolean {
      return true;
    }
  } as any;
}

// Polyfill for TransformStream required by MSW
if (typeof TransformStream === 'undefined') {
  global.TransformStream = class TransformStream {
    readable: any;
    writable: any;
    constructor() {
      this.readable = {};
      this.writable = {};
    }
  } as any;
}

setupMSWServer(dhLocalApiEnvironment.apiBase, mocks);
addDomMatchers();
setUpTestbed();
setUpAngularTestingLibrary();
