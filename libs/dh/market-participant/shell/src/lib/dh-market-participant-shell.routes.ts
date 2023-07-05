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
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { DhMarketParticipantOrganizationComponent } from '@energinet-datahub/dh/market-participant/feature-organization';
import { DhMarketParticipantEditOrganizationComponent } from '@energinet-datahub/dh/market-participant/feature-edit-organization';
import {
  dhMarketParticipantPath,
  dhMarketParticipantActorIdParam,
  dhMarketParticipantActorsCreatePath,
  dhMarketParticipantActorsEditPath,
  dhMarketParticipantActorsPath,
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantOrganizationsCreatePath,
  dhMarketParticipantOrganizationsEditPath,
  dhMarketParticipantOrganizationsPath,
  dhMarketParticipantGridAreasPath,
} from '@energinet-datahub/dh/market-participant/routing';
import { DhMarketParticipantEditActorComponent } from '@energinet-datahub/dh/market-participant/edit-actor';
import { DhMarketParticipantGridAreaComponent } from '@energinet-datahub/dh/market-participant/grid-areas/shell';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

export const dhMarketParticipantShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: dhMarketParticipantActorsPath,
  },
  {
    path: dhMarketParticipantActorsPath,
    canMatch: [
      () => {
        const router = inject(Router);
        const featureFlagsService = inject(DhFeatureFlagsService);

        if (featureFlagsService.isEnabled('market_participant_actors_feature_flag')) {
          return true;
        }

        return router.createUrlTree([
          '/',
          dhMarketParticipantPath,
          dhMarketParticipantOrganizationsPath,
        ]);
      },
    ],
    loadComponent: () =>
      import('@energinet-datahub/dh/market-participant/actors/shell').then(
        (esModule) => esModule.DhMarketParticipantActorsShellComponent
      ),
    data: {
      titleTranslationKey: 'marketParticipant.actors.topBarTitle',
    },
  },
  {
    path: dhMarketParticipantOrganizationsPath,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DhMarketParticipantOrganizationComponent,
        data: {
          titleTranslationKey: 'marketParticipant.organization.topBarTitle',
        },
      },
      {
        path: dhMarketParticipantOrganizationsCreatePath,
        canActivate: [PermissionGuard(['organizations:manage'])],
        component: DhMarketParticipantEditOrganizationComponent,
      },
      {
        path: `:${dhMarketParticipantOrganizationIdParam}`,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: dhMarketParticipantOrganizationsEditPath,
          },
          {
            path: `${dhMarketParticipantOrganizationsEditPath}`,
            canActivate: [PermissionGuard(['organizations:manage'])],
            component: DhMarketParticipantEditOrganizationComponent,
          },
          {
            path: dhMarketParticipantActorsPath,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: dhMarketParticipantActorsCreatePath,
              },
              {
                path: dhMarketParticipantActorsCreatePath,
                canActivate: [PermissionGuard(['actors:manage'])],
                component: DhMarketParticipantEditActorComponent,
              },
              {
                path: `:${dhMarketParticipantActorIdParam}`,
                canActivate: [PermissionGuard(['actors:manage'])],
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: dhMarketParticipantActorsEditPath,
                  },
                  {
                    path: dhMarketParticipantActorsEditPath,
                    component: DhMarketParticipantEditActorComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: dhMarketParticipantGridAreasPath,
    component: DhMarketParticipantGridAreaComponent,
    data: {
      titleTranslationKey: 'marketParticipant.gridAreas.topBarTitle',
    },
  },
];
