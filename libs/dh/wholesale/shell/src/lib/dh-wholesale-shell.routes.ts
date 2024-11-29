import { Route } from '@angular/router';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { WholesaleSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhWholesaleShellRoutes: Route[] = [
  {
    path: getPath<WholesaleSubPaths>('request-calculation'),
    canActivate: [
      PermissionGuard([
        'request-aggregated-measured-data:view',
        'request-wholesale-settlement:view',
      ]),
    ],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-request-calculation'),
    data: {
      titleTranslationKey: 'wholesale.requestCalculation.topBarTitle',
    },
  },
  {
    path: getPath<WholesaleSubPaths>('calculations'),
    canActivate: [PermissionGuard(['calculations:view'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-calculations'),
    data: {
      titleTranslationKey: 'wholesale.calculations.topBarTitle',
    },
  },
  {
    path: getPath<WholesaleSubPaths>('settlement-reports'),
    canActivate: [PermissionGuard(['settlement-reports:manage'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-settlement-reports'),
    data: {
      titleTranslationKey: 'wholesale.settlementReports.topBarTitle',
    },
  },
];
