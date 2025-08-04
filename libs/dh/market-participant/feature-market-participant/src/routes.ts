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
import { Routes } from '@angular/router';

import { MarketParticipantSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhMarketParticipantShellRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../src/components/dh-market-participant.component').then(
        (x) => x.DhMarketParticipantComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<MarketParticipantSubPaths>('actors'),
      },
      {
        path: getPath<MarketParticipantSubPaths>('actors'),
        loadComponent: () =>
          import('../src/components/dh-actors-overview.component').then(
            (x) => x.DhActorsOverviewComponent
          ),
        data: {
          titleTranslationKey: 'marketParticipant.actors.topBarTitle',
        },
      },
      {
        path: getPath<MarketParticipantSubPaths>('organizations'),
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/feature-organizations'),
        data: {
          titleTranslationKey: 'marketParticipant.organizationsOverview.organizations',
        },
        children: [
          {
            path: 'details/:id',
            loadComponent: () =>
              import('@energinet-datahub/dh/market-participant/feature-organizations').then(
                (m) => m.DhOrganizationDetailsComponent
              ),
            children: [
              {
                path: 'edit',
                loadComponent: () =>
                  import('@energinet-datahub/dh/market-participant/feature-organizations').then(
                    (m) => m.DhOrganizationEditModalComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: getPath<MarketParticipantSubPaths>('market-roles'),
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/feature-market-roles'),
        data: {
          titleTranslationKey: 'marketParticipant.marketRolesOverview.marketRoles',
        },
      },
    ],
  },
];
