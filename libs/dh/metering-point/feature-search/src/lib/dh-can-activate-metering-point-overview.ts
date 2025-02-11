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
import { DoesMeteringPointExistDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { dhIsValidMeteringPointId } from './dh-metering-point-utils';
import { dhMeteringPointIdParam } from './dh-metering-point-id-param';

export const dhCanActivateMeteringPointOverview: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Promise<UrlTree | boolean> | UrlTree => {
  const meteringPointId: string = route.params[dhMeteringPointIdParam];
  const isValidMP = dhIsValidMeteringPointId(meteringPointId);
  const router = inject(Router);

  if (isValidMP) {
    return query(DoesMeteringPointExistDocument, { variables: { meteringPointId } })
      .result()
      .then((result) => {
        if (!result.data) {
          return router.createUrlTree(
            [getPath<BasePaths>('metering-point'), getPath<MeteringPointSubPaths>('search')],
            {
              queryParams: {
                [dhMeteringPointIdParam]: meteringPointId,
              },
            }
          );
        }

        return true;
      });
  }

  return router.createUrlTree([
    getPath<BasePaths>('metering-point'),
    getPath<MeteringPointSubPaths>('search'),
  ]);
};
