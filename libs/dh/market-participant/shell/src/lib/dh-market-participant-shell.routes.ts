import { Routes } from '@angular/router';

import { MarketParticipantSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhMarketParticipantShellRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@energinet-datahub/dh/market-participant/actors/shell'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<MarketParticipantSubPaths>('actors'),
      },
      {
        path: getPath<MarketParticipantSubPaths>('actors'),
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/actors/feature-actors'),
        data: {
          titleTranslationKey: 'marketParticipant.actors.topBarTitle',
        },
      },
      {
        path: getPath<MarketParticipantSubPaths>('organizations'),
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/actors/feature-organizations'),
        data: {
          titleTranslationKey: 'marketParticipant.organizationsOverview.organizations',
        },
        children: [
          {
            path: 'details/:id',
            loadComponent: () =>
              import('@energinet-datahub/dh/market-participant/actors/feature-organizations').then(
                (m) => m.DhOrganizationDetailsComponent
              ),
            children: [
              {
                path: 'edit',
                loadComponent: () =>
                  import(
                    '@energinet-datahub/dh/market-participant/actors/feature-organizations'
                  ).then((m) => m.DhOrganizationEditModalComponent),
              },
            ],
          },
        ],
      },
      {
        path: getPath<MarketParticipantSubPaths>('market-roles'),
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/actors/feature-market-roles'),
        data: {
          titleTranslationKey: 'marketParticipant.marketRolesOverview.marketRoles',
        },
      },
    ],
  },
];
