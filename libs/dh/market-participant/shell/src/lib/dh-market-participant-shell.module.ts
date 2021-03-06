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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DhMarketParticipantOrganizationComponent,
  DhMarketParticipantOrganizationScam,
} from '@energinet-datahub/dh/market-participant/feature-organization';
import {
  DhMarketParticipantEditOrganizationComponent,
  DhMarketParticipantEditOrganizationScam,
} from '@energinet-datahub/dh/market-participant/feature-edit-organization';
import {
  dhMarketParticipantActorIdParam,
  dhMarketParticipantActorsCreatePath,
  dhMarketParticipantActorsEditPath,
  dhMarketParticipantActorsPath,
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantOrganizationsCreatePath,
  dhMarketParticipantOrganizationsEditPath,
  dhMarketParticipantOrganizationsPath,
} from '@energinet-datahub/dh/market-participant/routing';
import { DhMarketParticipantEditActorComponent } from '@energinet-datahub/dh/market-participant/edit-actor';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DhMarketParticipantOrganizationComponent,
  },
  {
    path: dhMarketParticipantOrganizationsPath,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: dhMarketParticipantOrganizationsCreatePath,
      },
      {
        path: dhMarketParticipantOrganizationsCreatePath,
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
                component: DhMarketParticipantEditActorComponent,
              },
              {
                path: `:${dhMarketParticipantActorIdParam}`,
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
];

@NgModule({
  imports: [
    DhMarketParticipantOrganizationScam,
    DhMarketParticipantEditOrganizationScam,
    RouterModule.forChild(routes),
  ],
})
export class DhMarketParticipantShellModule {}
