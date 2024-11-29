import { Routes } from '@angular/router';

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';

import { EoFaqPageComponent } from './lib/eo-faq-page.component';
import { EoGeographyPageComponent } from './lib/eo-geography-page.component';
import { EoHelpPageComponent } from './lib/eo-help-page.component';
import { EoIntroductionPageComponent } from './lib/eo-introduction-page.component';
import { EoSimultaneityPageComponent } from './lib/eo-simultaneity-page.component';

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
