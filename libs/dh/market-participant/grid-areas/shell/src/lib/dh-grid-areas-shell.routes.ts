import { Routes } from '@angular/router';

import { DhGridAreasShellComponent } from './dh-grid-areas-shell.component';

export const dhGridAreasShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DhGridAreasShellComponent,
    data: {
      titleTranslationKey: 'marketParticipant.gridAreas.topBarTitle',
    },
  },
];
