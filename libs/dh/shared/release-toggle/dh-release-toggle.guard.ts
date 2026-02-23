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
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, filter, take } from 'rxjs/operators';
import { DhReleaseToggleService } from './dh-release-toggle.service';

/**
 * Release toggle guard that blocks navigation if toggle is not enabled
 * and redirects to the root route. Waits for toggles to load before deciding.
 * @param toggleName Name of the toggle that must be enabled
 * @returns CanActivateFn
 */
export function dhReleaseToggleGuard(toggleName: string): CanActivateFn {
  return () => {
    const releaseToggleService = inject(DhReleaseToggleService);
    const router = inject(Router);

    const checkToggle = () => releaseToggleService.isEnabled(toggleName) || router.parseUrl('/');

    if (!releaseToggleService.loading()) {
      return checkToggle();
    }

    return toObservable(releaseToggleService.loading).pipe(
      filter((loading) => !loading),
      take(1),
      map(() => checkToggle())
    );
  };
}
