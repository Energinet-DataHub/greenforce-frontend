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
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  PartialMatchRouteSnapshot,
  Route,
  Router,
  Routes,
  UrlSegment,
} from '@angular/router';
import { inject } from '@angular/core';

import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/util-release-toggle';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  BasePaths,
  ChargesSubPaths,
  getPath,
} from '@energinet-datahub/dh/core/configuration-routing';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { ChargeType, GetChargeByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { correctChargeTypeView } from './components/util/correct-charge-type-view';

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
        path: `${getPath<ChargesSubPaths>('prices')}/:time-resolution`,
        canMatch: [everythingButQuarterHourlyAndHourlyTariff()],
        loadComponent: () =>
          import('./components/series/series').then((m) => m.DhChargesSeriesTable),
      },
      {
        path: `${getPath<ChargesSubPaths>('prices')}`,
        canActivate: [quarterHourlyAndHourlyTariffOnly()],
        children: [
          {
            path: '',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'day',
              },
              {
                path: 'day',
                loadComponent: () =>
                  import('./components/series/series').then((m) => m.DhChargesSeriesTable),
              },
            ],
          },
        ],
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

function everythingButQuarterHourlyAndHourlyTariff(): CanMatchFn {
  return (route: Route, segments: UrlSegment[], snapshot?: PartialMatchRouteSnapshot) => {
    const router = inject(Router);
    const idParam: string = snapshot?.params['id'];
    const timeResolutionParam: string = snapshot?.params['time-resolution'];

    return query(GetChargeByIdDocument, () => ({
      variables: { id: idParam },
    }))
      .result()
      .then((result) => {
        if (!result.data.chargeById) {
          return router.createUrlTree([getPath<BasePaths>('charges')]);
        }

        const { resolution, type } = result.data.chargeById;

        if (
          tariffChargeTypes.includes(type) &&
          (resolution === 'QUARTER_HOURLY' || resolution === 'HOURLY')
        ) {
          return false;
        }

        const correctViewForResolution = correctChargeTypeView(resolution);

        if (timeResolutionParam === correctViewForResolution) {
          return true;
        }

        return router.createUrlTree([
          getPath<BasePaths>('charges'),
          idParam,
          getPath<ChargesSubPaths>('prices'),
          correctViewForResolution,
        ]);
      });
  };
}

function quarterHourlyAndHourlyTariffOnly(): CanActivateFn {
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

        const { resolution, type } = result.data.chargeById;

        if (
          tariffChargeTypes.includes(type) &&
          (resolution === 'QUARTER_HOURLY' || resolution === 'HOURLY')
        ) {
          return true;
        }

        return chargesUrlTree;
      });
  };
}
