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
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';

import { isValidMeteringPointId } from './dh-is-valid-metering-point-id';
import { dhMeteringPointIdParam } from './dh-metering-point-id-param';

export const dhCanActivateMeteringPointOverview: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const meteringPointId: string = route.params[dhMeteringPointIdParam];

  return (
    isValidMeteringPointId(meteringPointId) ||
    inject(Router).createUrlTree([
      getPath<BasePaths>('metering-point'),
      getPath<MeteringPointSubPaths>('search'),
    ])
  );
};
