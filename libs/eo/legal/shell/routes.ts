import { Routes } from '@angular/router';

export const eoLegalRoutes: Routes = [
  {
    path: 'terms',
    loadComponent: () =>
      import('@energinet-datahub/eo/legal/terms').then((x) => x.EoTermsComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('@energinet-datahub/eo/legal/privacy-policy').then((x) => x.EoPrivacyPolicyComponent),
  },
  {
    path: 'service-provider-terms',
    loadComponent: () =>
      import('@energinet-datahub/eo/legal/service-provider-terms').then(
        (x) => x.EoServiceProviderTermsComponent
      ),
  },
];
