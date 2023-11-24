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
import { Routes } from '@angular/router';

import {
  dhMarketParticipantActorsPath,
  dhMarketParticipantGridAreasPath,
} from '@energinet-datahub/dh/market-participant/routing';

export const dhMarketParticipantShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: dhMarketParticipantActorsPath,
  },
  {
    path: dhMarketParticipantActorsPath,
    loadComponent: () =>
      import('@energinet-datahub/dh/market-participant/actors/shell').then(
        (esModule) => esModule.DhMarketParticipantActorsShellComponent
      ),
    data: {
      titleTranslationKey: 'marketParticipant.actors.topBarTitle',
    },
  },
  {
    path: dhMarketParticipantGridAreasPath,
    loadComponent: () =>
      import('@energinet-datahub/dh/market-participant/grid-areas/shell').then(
        (esModule) => esModule.DhGridAreasShellComponent
      ),
    data: {
      titleTranslationKey: 'marketParticipant.gridAreas.topBarTitle',
    },
  },
];
