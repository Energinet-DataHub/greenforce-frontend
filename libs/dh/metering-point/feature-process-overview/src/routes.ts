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
import { ResolveFn, Routes } from '@angular/router';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  DhActorStorage,
  PermissionGuard,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/util-release-toggle';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

// The parent `:internalMeteringPointId` route resolves these values; we inherit
// them here via `paramsInheritanceStrategy: 'always'`. Typed in one place so a
// rename in the parent resolver fails type-checking instead of silently producing
// undefined.
interface InheritedRouteData {
  meteringPointId: string;
  searchMigratedMeteringPoints: boolean;
}

function isEnergySupplierResponsibleResolver(): ResolveFn<boolean> {
  return async (route) => {
    const actor = inject(DhActorStorage).getSelectedActor();
    const { meteringPointId, searchMigratedMeteringPoints } = route.data as InheritedRouteData;

    const { data } = await query(GetMeteringPointByIdDocument, {
      fetchPolicy: 'cache-first',
      variables: {
        meteringPointId,
        actorGln: actor.gln,
        searchMigratedMeteringPoints,
      },
    }).result();

    return !!data?.meteringPoint?.isEnergySupplier;
  };
}

export const meteringPointProcessOverviewRoutes: Routes = [
  {
    canActivate: [
      PermissionGuard(['metering-point:process-overview']),
      dhReleaseToggleGuard('PM116-PROCESSOVERVIEW'),
    ],
    path: '',
    resolve: {
      isEnergySupplierResponsible: isEnergySupplierResponsibleResolver(),
    },
    loadComponent: () =>
      import('./components/overview').then((m) => m.DhMeteringPointProcessOverviewTable),
    children: [
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./components/details/details').then(
            (m) => m.DhMeteringPointProcessOverviewDetails
          ),
      },
    ],
  },
];
