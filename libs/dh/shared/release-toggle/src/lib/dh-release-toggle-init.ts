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
import { runInInjectionContext, Injector, inject } from '@angular/core';
import { DhReleaseToggleService } from './dh-release-toggle.service';

/**
 * Initialize release toggles after app bootstrap
 */
export function initializeReleaseToggles(injector: Injector): void {
  runInInjectionContext(injector, () => {
    const releaseToggleService = inject(DhReleaseToggleService);

    // Start the initial fetch
    releaseToggleService.refetch().catch((error) => {
      console.warn('Initial release toggle fetch failed:', error);
    });
  });
}
