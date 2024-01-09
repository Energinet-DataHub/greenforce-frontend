import { Routes } from '@angular/router';

import { DhImbalancePricesShellComponent } from './dh-imbalance-prices-shell.component';

export const dhImbalancePricesShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DhImbalancePricesShellComponent,
    data: {
      titleTranslationKey: 'imbalancePrices.topBarTitle',
    },
  },
];
