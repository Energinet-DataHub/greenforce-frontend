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
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { EoFaqPageComponent } from './lib/eo-faq-page.component';
import { EoGeographyPageComponent } from './lib/eo-geography-page.component';
import { EoHelpPageComponent } from './lib/eo-help-page.component';
import { EoIntroductionPageComponent } from './lib/eo-introduction-page.component';
import { EoSimultaneityPageComponent } from './lib/eo-simultaneity-page.component';

const routes: Routes = [
  { path: '', component: EoHelpPageComponent, data: { title: 'Help' } },
  { path: eoRoutes.faq, component: EoFaqPageComponent, data: { title: 'FAQ' } },
  {
    path: eoRoutes.introduction,
    component: EoIntroductionPageComponent,
    data: { title: 'Introduktion til EnergiOprindelse' },
  },
  {
    path: eoRoutes.simultaneity,
    component: EoSimultaneityPageComponent,
    data: { title: 'Samtidighed' },
  },
  {
    path: eoRoutes.geography,
    component: EoGeographyPageComponent,
    data: { title: 'Geografi' },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EoHelpModule {}
