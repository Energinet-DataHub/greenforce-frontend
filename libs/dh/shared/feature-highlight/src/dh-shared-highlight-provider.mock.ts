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
import { makeEnvironmentProviders } from '@angular/core';
import { WATT_CODE_HIGHLIGHT_WORKER_FACTORY } from '@energinet-datahub/watt/code';

export const highlightWorkerProvider = makeEnvironmentProviders([
  {
    provide: WATT_CODE_HIGHLIGHT_WORKER_FACTORY,
    useValue: () =>
      new Worker(new URL('./dh-shared-highlight.worker.ts', 'https://localhost:4200/')),
  },
]);
