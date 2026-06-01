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
import { HttpErrorResponse } from '@angular/common/http';
import { inject, provideAppInitializer } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { firstValueFrom } from 'rxjs';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { DhActorTokenService } from './dh-actor-token.service';
import { DhStartupErrorService } from './dh-startup-error.service';

/**
 * App initializer that pre-warms the internal token + user-actors cache
 * before the application shell renders.
 *
 * Why:
 *   The `DhAuthorizationInterceptor` calls `acquireToken()` on every
 *   outgoing request with an Authorization header. That call fans out into
 *   `GetUserActors` -> `GetToken` round-trips to the BFF (which itself
 *   proxies to the market participant service and can be slow).
 *
 *   Without this initializer, the very first guarded navigation after
 *   login pays the full cost of that round-trip while the user looks at
 *   a blank shell with no feedback. By awaiting `acquireToken()` here we
 *   hold the bootstrap promise open until the cache is warm, which keeps
 *   the startup splash (see `apps/dh/app-dh/src/index.html`) visible the
 *   whole time and lets the shell render fully-interactive.
 *
 * Failure behaviour:
 *   - When no MSAL account exists yet (first-time visit / expired session),
 *     the initializer short-circuits so the normal login redirect flow in
 *     `DataHubAppComponent` can take over.
 *   - When `GetUserActors` itself fails, the initializer reports the error
 *     to `DhStartupErrorService` and returns normally. Bootstrap then
 *     completes successfully and `DataHubAppComponent` renders
 *     `DhStartupErrorComponent`
 *   - When `GetToken` fails, the `DhActorTokenService` already triggers an
 *     MSAL logout redirect, so the initializer swallows that error to let
 *     the redirect take effect uninterrupted.
 */
export const dhActorTokenInitializer = provideAppInitializer(async () => {
  const msalService = inject(MsalService);
  const actorTokenService = inject(DhActorTokenService);
  const apiEnvironment = inject(dhApiEnvironmentToken);
  const startupErrorService = inject(DhStartupErrorService);

  try {
    // `handleRedirectObservable` initializes the MSAL instance internally
    // and processes any pending auth response in the URL. It's idempotent,
    // so calling it here in addition to the existing call in
    // `DataHubAppComponent.ngOnInit` is safe.
    await firstValueFrom(msalService.handleRedirectObservable(), { defaultValue: null });
  } catch {
    // Let the app-level handler in `DataHubAppComponent` deal with redirect errors.
    return;
  }

  const activeAccount =
    msalService.instance.getActiveAccount() ?? msalService.instance.getAllAccounts()[0];

  if (!activeAccount) {
    // Not signed in - login flow will handle it; nothing to pre-warm.
    return;
  }

  if (!msalService.instance.getActiveAccount()) {
    msalService.instance.setActiveAccount(activeAccount);
  }

  try {
    await firstValueFrom(actorTokenService.acquireToken());
  } catch (error) {
    if (isGetUserActorsError(error, apiEnvironment.getUserActorsUrl)) {
      startupErrorService.setError('get-user-actors', error);
    }
    // Any other failure (e.g. GetToken) is left to the service-level handler
    // (which already triggers an MSAL logout) or the regular HTTP interceptor.
  }
});

function isGetUserActorsError(error: unknown, getUserActorsUrl: string): boolean {
  return error instanceof HttpErrorResponse && (error.url?.endsWith(getUserActorsUrl) ?? false);
}
