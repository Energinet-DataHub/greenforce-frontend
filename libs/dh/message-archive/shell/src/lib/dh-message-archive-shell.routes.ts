import { Routes } from '@angular/router';

export const dhMessageArchiveShellRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@energinet-datahub/dh/message-archive/feature-search'),
    pathMatch: 'full',
    data: {
      titleTranslationKey: 'messageArchive.topBarTitle',
    },
  },
];
