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
import { mocks, handlers, onUnhandledRequest } from './handlers';
import { setupWorker } from 'msw/browser';

declare const window: {
  cypressMockServiceWorkerIntercept: Promise<unknown> | undefined;
  serviceWorkerRegistration: Promise<unknown> | undefined;
} & Window;

export async function setupServiceWorker(apiBase: string, mocks: mocks) {
  try {
    if (window.cypressMockServiceWorkerIntercept) {
      await window.cypressMockServiceWorkerIntercept;
    }

    const worker = setupWorker(...handlers(apiBase, mocks));
    window.serviceWorkerRegistration = worker.start({ onUnhandledRequest });
    await window.serviceWorkerRegistration;
  } catch (error) {
    console.error('setupServiceWorker', error);
  }
}
