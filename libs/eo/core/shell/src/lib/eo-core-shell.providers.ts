import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
import { eoAuthorizationInterceptorProvider } from '@energinet-datahub/eo/shared/services';
import { MatDialogModule } from '@angular/material/dialog';
import { importProvidersFrom } from '@angular/core';

export const eoCoreShellProviders = [
  importProvidersFrom(MatDialogModule),
  browserConfigurationProviders,
  eoAuthorizationInterceptorProvider,
];
