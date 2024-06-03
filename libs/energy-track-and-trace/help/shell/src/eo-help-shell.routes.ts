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

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';

import { EoFaqPageComponent } from './lib/ett-faq-page.component';
import { EoGeographyPageComponent } from './lib/ett-geography-page.component';
import { EoHelpPageComponent } from './lib/ett-help-page.component';
import { EoIntroductionPageComponent } from './lib/ett-introduction-page.component';
import { EoSimultaneityPageComponent } from './lib/ett-simultaneity-page.component';

export const eoHelpRoutes: Routes = [
  { path: '', component: EoHelpPageComponent, title: translations.help.title },
  { path: eoRoutes.faq, component: EoFaqPageComponent, title: translations.faq.title },
  {
    path: eoRoutes.introduction,
    component: EoIntroductionPageComponent,
    title: 'Introduktion til EnergiOprindelse',
  },
  {
    path: eoRoutes.simultaneity,
    component: EoSimultaneityPageComponent,
    title: 'Samtidighed',
  },
  {
    path: eoRoutes.geography,
    component: EoGeographyPageComponent,
    title: 'Geografi',
  },
  { path: '**', redirectTo: '' },
];
