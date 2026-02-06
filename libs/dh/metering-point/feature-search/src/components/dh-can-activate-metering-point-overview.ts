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
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { DoesInternalMeteringPointIdExistDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  dhIsValidMeteringPointId,
  dhIsEM1InternalId,
  dhIsEM2EncodedId,
} from '@energinet-datahub/dh/shared/ui-util';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { dhInternalMeteringPointIdParam } from './dh-metering-point-params';

export const dhCanActivateMeteringPointOverview: CanActivateFn = ():
  | Promise<UrlTree | boolean>
  | UrlTree => {
  const router = inject(Router);
  const environment = inject(dhAppEnvironmentToken);

  const searchRoute = router.createUrlTree([
    getPath<BasePaths>('metering-point'),
    getPath<MeteringPointSubPaths>('search'),
  ]);

  const idParam = findIdParam();

  if (dhIsValidMeteringPointId(idParam)) {
    // Only internal IDs are allowed in the URL
    return searchRoute;
  }

  const isEM1Id = dhIsEM1InternalId(idParam);
  const isEM2Id = dhIsEM2EncodedId(idParam);

  if (isEM1Id || isEM2Id) {
    return query(DoesInternalMeteringPointIdExistDocument, {
      variables: {
        internalMeteringPointId: idParam,
        searchMigratedMeteringPoints: isEM1Id,
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

function findIdParam(): string {
  const navigation = inject(Router).currentNavigation();

  const idParamInState: string | undefined =
    navigation?.extras.state?.[dhInternalMeteringPointIdParam];
  const idParamInSS = sessionStorage.getItem(dhInternalMeteringPointIdParam);

  return idParamInState ?? idParamInSS ?? '';
}
