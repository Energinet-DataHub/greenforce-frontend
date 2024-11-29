import { MsalGuard } from '@azure/msal-angular';
import { Routes } from '@angular/router';

import { DhCoreShellComponent } from './dh-core-shell.component';
import { DhCoreLoginComponent } from './dh-core-login.component';

import { BasePaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhCoreShellRoutes: Routes = [
  {
    path: '',
    component: DhCoreShellComponent,
    children: [
      {
        path: '',
        redirectTo: getPath<BasePaths>('message-archive'),
        pathMatch: 'full',
      },
      {
        path: getPath<BasePaths>('message-archive'),
        loadChildren: () => import('@energinet-datahub/dh/message-archive/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('esett'),
        loadChildren: () => import('@energinet-datahub/dh/esett/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('imbalance-prices'),
        loadChildren: () => import('@energinet-datahub/dh/imbalance-prices/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('market-participant'),
        loadChildren: () => import('@energinet-datahub/dh/market-participant/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('grid-areas'),
        loadChildren: () => import('@energinet-datahub/dh/market-participant/grid-areas/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('wholesale'),
        loadChildren: () => import('@energinet-datahub/dh/wholesale/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('admin'),
        loadChildren: () => import('@energinet-datahub/dh/admin/shell'),
        canActivate: [MsalGuard],
      },
    ],
  },
  {
    path: getPath<BasePaths>('login'),
    pathMatch: 'full',
    component: DhCoreLoginComponent,
  },
];
