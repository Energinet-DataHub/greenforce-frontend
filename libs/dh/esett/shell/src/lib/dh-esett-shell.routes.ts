import { Routes } from '@angular/router';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhESettShellComponent } from './dh-esett-shell.component';

import { type ESettSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhESettShellRoutes: Routes = [
  {
    path: '',
    component: DhESettShellComponent,
    canActivate: [PermissionGuard(['esett-exchange:manage'])],
    data: {
      titleTranslationKey: 'eSett.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<ESettSubPaths>('outgoing-messages'),
      },
      {
        path: getPath<ESettSubPaths>('outgoing-messages'),
        loadComponent: () => import('@energinet-datahub/dh/esett/feature-outgoing-messages'),
      },
      {
        path: getPath<ESettSubPaths>('metering-gridarea-imbalance'),
        loadComponent: () =>
          import('@energinet-datahub/dh/esett/feature-metering-gridarea-imbalance'),
      },
      {
        path: getPath<ESettSubPaths>('balance-responsible'),
        loadComponent: () => import('@energinet-datahub/dh/esett/feature-balance-responsible'),
      },
    ],
  },
];
