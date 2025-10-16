//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MsalInterceptor,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuard,
  MsalBroadcastService,
} from '@azure/msal-angular';
import { FormGroupDirective } from '@angular/forms';
import { IPublicClientApplication } from '@azure/msal-browser';
import { of } from 'rxjs';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

import { translocoProviders } from '@energinet-datahub/dh/globalization/configuration-localization';
import { dhWattTranslationsProviders } from '@energinet-datahub/dh/globalization/configuration-watt-translation';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from '@energinet-datahub/dh/auth/msal';
import { graphQLProvider } from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  dhApiEnvironmentToken,
  dhB2CEnvironmentToken,
  environment,
} from '@energinet-datahub/dh/shared/environments';
import { dhLanguageServiceInitializer } from '@energinet-datahub/dh/globalization/feature-language-picker';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { highlightWorkerProvider } from '@energinet-datahub/dh/shared/feature-highlight';
import { applicationInsightsProviders } from '@energinet-datahub/dh/shared/util-application-insights';
import { dhAuthorizationInterceptor } from '@energinet-datahub/dh/shared/feature-authorization';
import { danishLocalProviders } from '@energinet-datahub/gf/globalization/configuration-danish-locale';
import { microsoftClarityProviders } from '@energinet-datahub/dh/shared/feature-microsoft-clarity';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { dhNewVersionManagerInitializer } from '@energinet-datahub/dh/shared/util-new-version-manager';

if (environment.authDisabled) {
  MsalGuard.prototype.canActivate = () => of(true);

  MsalInterceptor.prototype.intercept = (req, next) => {
    const access = localStorage.getItem('access_token');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access}`,
      },
    });
    return next.handle(req);
  };

  MsalService.prototype.instance = {
    getActiveAccount: () => {
      return { username: 'Test' };
    },
  } as IPublicClientApplication;
}

const interceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true,
  },
  // dhAuthorizationInterceptor must be registered after MsalInterceptor
  dhAuthorizationInterceptor,
];

const msalProviders = [
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  {
    provide: MSAL_INSTANCE,
    useFactory: MSALInstanceFactory,
    deps: [dhB2CEnvironmentToken],
  },
  {
    provide: MSAL_GUARD_CONFIG,
    useFactory: MSALGuardConfigFactory,
    deps: [dhB2CEnvironmentToken],
  },
  {
    provide: MSAL_INTERCEPTOR_CONFIG,
    useFactory: MSALInterceptorConfigFactory,
    deps: [dhB2CEnvironmentToken, dhApiEnvironmentToken],
  },
];

export const dhCoreShellProviders = [
  FormGroupDirective,
  environment.production ? applicationInsightsProviders : [],
  microsoftClarityProviders,
  dhWattTranslationsProviders,
  danishLocalProviders,
  translocoProviders,
  graphQLProvider,
  danishDatetimeProviders,
  WattModalService,
  interceptors,
  msalProviders,
  dhLanguageServiceInitializer,
  dhNewVersionManagerInitializer,
  provideHotToastConfig(),
  highlightWorkerProvider,
];
