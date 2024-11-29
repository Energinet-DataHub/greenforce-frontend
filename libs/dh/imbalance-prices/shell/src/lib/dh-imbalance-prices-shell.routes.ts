import { Routes } from '@angular/router';

import { DhImbalancePricesShellComponent } from './dh-imbalance-prices-shell.component';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

export const dhImbalancePricesShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [PermissionGuard(['imbalance-prices:view'])],
    component: DhImbalancePricesShellComponent,
    data: {
      titleTranslationKey: 'imbalancePrices.topBarTitle',
    },
  },
];
