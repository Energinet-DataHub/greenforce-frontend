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
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { DoesInternalMeteringPointIdExistDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  dhIsValidInternalId,
  dhIsValidMeteringPointId,
} from '@energinet-datahub/dh/shared/ui-util';
import { DhAppEnvironment, dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { dhExternalOrInternalMeteringPointIdParam } from './dh-metering-point-params';

export const dhCanActivateMeteringPointOverview: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Promise<UrlTree | boolean> | UrlTree => {
  const router = inject(Router);
  const environment = inject(dhAppEnvironmentToken);

  const searchRoute = router.createUrlTree([
    getPath<BasePaths>('metering-point'),
    getPath<MeteringPointSubPaths>('search'),
  ]);

  const idParam: string = route.params[dhExternalOrInternalMeteringPointIdParam];

  const meteringPointId = dhIsValidMeteringPointId(idParam) ? idParam : undefined;

  if (meteringPointId && environment.current === DhAppEnvironment.prod) {
    // In production, only internal IDs are allowed in the URL
    return searchRoute;
  }

  const internalMeteringPointId =
    meteringPointId === undefined && dhIsValidInternalId(idParam) ? idParam : undefined;

  if (meteringPointId || internalMeteringPointId) {
    return query(DoesInternalMeteringPointIdExistDocument, {
      variables: {
        internalMeteringPointId,
        meteringPointId,
        searchMigratedMeteringPoints: meteringPointId !== undefined,
        environment: environment.current,
      },
    })
      .result()
      .then((result) => {
        if (!result.data) {
          return searchRoute;
        }

        return true;
      });
  }

  return searchRoute;
};
