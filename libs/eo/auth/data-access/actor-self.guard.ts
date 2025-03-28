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
import { Router, CanActivateFn } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

import { EoActorService } from './actor.service';

export const eoActorSelfGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const actorService = inject(EoActorService);

  // Redirect to dashboard if user is not acting as self
  if (!actorService.isSelf()) {
    router.navigate([transloco.getActiveLang(), 'dashboard']);
    return false;
  } else {
    return true;
  }
};
