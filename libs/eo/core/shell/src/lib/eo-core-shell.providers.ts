import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TitleStrategy } from '@angular/router';

import { translocoProviders } from '@energinet-datahub/eo/globalization/configuration-localization';
import { eoApiVersioningInterceptorProvider } from '@energinet-datahub/eo/core/api-versioning';

import {
  eoAuthorizationInterceptorProvider,
  eoOrganizationIdInterceptorProvider,
} from '@energinet-datahub/eo/auth/data-access';

import { danishLocalProviders } from '@energinet-datahub/gf/globalization/configuration-danish-locale';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { eoLanguageServiceInitializer } from '@energinet-datahub/eo/globalization/feature-language-switcher';
import { eoWattTranslationsProviders } from '@energinet-datahub/eo/globalization/configuration-watt-translation';

import { PageTitleStrategy } from './title-strategy.service';

export const eoCoreShellProviders = [
  browserConfigurationProviders,
  danishLocalProviders,
  danishDatetimeProviders,
  importProvidersFrom(MatDialogModule, MatSnackBarModule),
  eoAuthorizationInterceptorProvider,
  eoOrganizationIdInterceptorProvider,
  eoApiVersioningInterceptorProvider,
  WattModalService,
  ...translocoProviders,
  eoLanguageServiceInitializer,
  eoWattTranslationsProviders,
  {
    provide: TitleStrategy,
    useClass: PageTitleStrategy,
  },
];
