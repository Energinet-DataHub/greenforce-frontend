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
import { ActivatedRouteSnapshot, CanActivateFn, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/util-release-toggle';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  BasePaths,
  ChargesSubPaths,
  ChargeTariffSubPaths,
  getPath,
} from '@energinet-datahub/dh/core/configuration-routing';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  ChargeResolution,
  ChargeType,
  GetChargeByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

const tariffChargeTypes: ChargeType[] = ['TARIFF', 'TARIFF_TAX'];

export const chargeRoutes: Routes = [
  {
    data: {
      titleTranslationKey: 'charges.charges.topBarTitle',
    },
    path: '',
    canActivate: [PermissionGuard(['charges:view']), dhReleaseToggleGuard('PM58-PRICES-UI')],
    loadComponent: () => import('./components/charges').then((m) => m.DhCharges),
    children: [
      {
        path: 'create',
        loadComponent: () => import('./components/actions/create'),
      },
    ],
  },
  {
    path: ':id',
    canActivate: [PermissionGuard(['charges:view']), dhReleaseToggleGuard('PM58-PRICES-UI')],
    loadComponent: () =>
      import('./components/information/information').then((m) => m.DhChargesInformation),
    children: [
      {
        path: `${getPath<ChargesSubPaths>('prices')}`,
        canActivate: [pricesLandingPage()],
        loadComponent: () =>
          import('./components/series/series').then((m) => m.DhChargesSeriesTable),
      },
      {
        path: `${getPath<ChargesSubPaths>('prices')}/day`,
        canActivate: [onlyTariffChargeTypes()],
        loadComponent: () =>
          import('./components/series/series').then((m) => m.DhChargesSeriesTable),
      },
      {
        path: `${getPath<ChargesSubPaths>('prices')}/month`,
        canActivate: [onlyTariffChargeTypes()],
        loadComponent: () =>
          import('./components/series/series').then((m) => m.DhChargesSeriesTable),
      },
      {
        path: getPath<ChargesSubPaths>('information'),
        loadComponent: () =>
          import('./components/information/information-periods').then(
            (m) => m.DhChargesInformationPeriods
          ),
      },
      {
        path: getPath<ChargesSubPaths>('history'),
        loadComponent: () =>
          import('./components/information/information-history').then(
            (m) => m.DhChargesInformationHistory
          ),
      },
      {
        path: 'stop',
        loadComponent: () => import('./components/actions/stop'),
        outlet: 'actions',
      },
      {
        path: 'edit',
        loadComponent: () => import('./components/actions/edit'),
        outlet: 'actions',
      },
      {
        path: 'upload-series',
        loadComponent: () => import('./components/actions/upload-series'),
        outlet: 'actions',
      },
    ],
  },
];

/**
 * Guard that ensures only tariff types are allowed to visit the URL, otherwise redirects to charges overview.
 */
function onlyTariffChargeTypes(): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);

    const idParam: string = route.params['id'];

    return query(GetChargeByIdDocument, () => ({
      variables: { id: idParam },
    }))
      .result()
      .then((result) => {
        const chargesUrlTree = router.createUrlTree([getPath<BasePaths>('charges')]);

        if (!result.data.chargeById) {
          return chargesUrlTree;
        }

        const { type, resolution } = result.data.chargeById;

        if (tariffChargeTypes.includes(type) === false) {
          return chargesUrlTree;
        }

        const tariffViewInRoute = route.url.at(-1)?.path as ChargeTariffSubPaths | undefined;
        const correctTariffViewForResolution = findAppropriateTariffView(resolution);

        if (tariffViewInRoute === correctTariffViewForResolution) {
          return true;
        }

        return router.createUrlTree(tariffViewUrlPath(idParam, correctTariffViewForResolution));
      });
  };
}

/**
 * Guard that redirects to the most specific price view based on charge type and resolution.
 * If the charge type is a tariff, redirects to the appropriate view based on resolution, otherwise allows navigation to the prices overview.
 */
function pricesLandingPage(): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);

    const idParam: string = route.params['id'];

    return query(GetChargeByIdDocument, () => ({
      variables: { id: idParam },
    }))
      .result()
      .then((result) => {
        if (!result.data.chargeById) {
          return router.createUrlTree([getPath<BasePaths>('charges')]);
        }

        const { type, resolution } = result.data.chargeById;

        if (tariffChargeTypes.includes(type)) {
          return router.createUrlTree(
            tariffViewUrlPath(idParam, findAppropriateTariffView(resolution))
          );
        }

        return true;
      });
  };
}

function findAppropriateTariffView(tariffResolution: ChargeResolution): ChargeTariffSubPaths {
  switch (tariffResolution) {
    case 'DAILY':
      return 'month';
    case 'HOURLY':
    default:
      return 'day';
  }
}

function tariffViewUrlPath(chargeId: string, view: ChargeTariffSubPaths): string[] {
  return [
    getPath<BasePaths>('charges'),
    chargeId,
    getPath<ChargesSubPaths>('prices'),
    getPath<ChargeTariffSubPaths>(view),
  ];
}
