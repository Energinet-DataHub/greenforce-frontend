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

import { ettRoutes } from '@energinet-datahub/ett/shared/utilities';
import { translations } from '@energinet-datahub/ett/translations';

import { EttFaqPageComponent } from './lib/ett-faq-page.component';
import { EttGeographyPageComponent } from './lib/ett-geography-page.component';
import { EttHelpPageComponent } from './lib/ett-help-page.component';
import { EttIntroductionPageComponent } from './lib/ett-introduction-page.component';
import { EttSimultaneityPageComponent } from './lib/ett-simultaneity-page.component';

export const ettHelpRoutes: Routes = [
  { path: '', component: EttHelpPageComponent, title: translations.help.title },
  { path: ettRoutes.faq, component: EttFaqPageComponent, title: translations.faq.title },
  {
    path: ettRoutes.introduction,
    component: EttIntroductionPageComponent,
    title: 'Introduktion til EnergiOprindelse',
  },
  {
    path: ettRoutes.simultaneity,
    component: EttSimultaneityPageComponent,
    title: 'Samtidighed',
  },
  {
    path: ettRoutes.geography,
    component: EttGeographyPageComponent,
    title: 'Geografi',
  },
  { path: '**', redirectTo: '' },
];
