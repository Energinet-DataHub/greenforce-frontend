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

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventPayload,
  EventType,
  IPublicClientApplication,
} from '@azure/msal-browser';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { LocalStorageFake } from '@energinet-datahub/dh/shared/test-util-auth';
import { of } from 'rxjs';
import { ScopeStorage } from './scope-storage';
import { ScopeService, actorScopesClaimsKey } from './scope.service';

describe(ScopeService.name, () => {
  const clientId = 'client_id';
  const localAccountId = 'local_account_id';
  const actorScopesClaim = 'actor1 actor2';

  test('should clear scopes from local storage, if no account is found', async () => {
    // arrange
    const remainingKey = 'other_key';
    const scopesKeyToBeRemoved = 'random_prefix';
    const scopeKeyToBeRemoved = 'another_random_prefix';

    const localStorage = new LocalStorageFake();
    const storage = new ScopeStorage(localStorage);

    localStorage.setItem(remainingKey, 'should not be cleared');
    storage.setScopes(scopesKeyToBeRemoved, 'scopes');
    storage.setActiveScope(scopeKeyToBeRemoved, 'scope');

    // act
    createTarget(null, true, 'clientId', null, storage);

    // assert
    expect(localStorage.getItem(remainingKey)).toBeTruthy();
    expect(storage.getScopes(scopesKeyToBeRemoved)).toBeFalsy();
    expect(storage.getActiveScope(scopeKeyToBeRemoved)).toBeFalsy();
  });

  test('should add actor scopes found in claims to local storage', async () => {
    // arrange
    const storage = new ScopeStorage(new LocalStorageFake());

    // act
    createTarget(localAccountId, true, clientId, actorScopesClaim, storage);

    // assert
    expect(storage.getScopes(localAccountId)).toEqual(actorScopesClaim);
  });

  test.each([true, false])(
    'getActiveScope should return fallbackValue if account is not found',
    (granFullAuthorizationEnabled) => {
      // arrange
      const target = createTarget(
        null,
        granFullAuthorizationEnabled,
        clientId,
        null,
        new ScopeStorage(new LocalStorageFake())
      );

      // act
      const actual = target.getActiveScope();

      // assert
      expect(actual).toEqual(granFullAuthorizationEnabled ? clientId : '');
    }
  );

  test.each([true, false])(
    'getActiveScope should return fallbackValue no scopes are found',
    (granFullAuthorizationEnabled) => {
      // arrange
      const target = createTarget(
        localAccountId,
        granFullAuthorizationEnabled,
        clientId,
        null,
        new ScopeStorage(new LocalStorageFake())
      );

      // act
      const actual = target.getActiveScope();

      // assert
      expect(actual).toEqual(granFullAuthorizationEnabled ? clientId : '');
    }
  );

  test('getActiveScope returns existing activeScope if contianed in actor scopes from claims', () => {
    // arrange
    const storage = new ScopeStorage(new LocalStorageFake());

    const target = createTarget(
      localAccountId,
      true,
      clientId,
      actorScopesClaim,
      storage
    );

    storage.setActiveScope(localAccountId, 'actor2');

    // act
    const actual = target.getActiveScope();

    // assert
    expect(actual).toEqual('actor2');
  });

  test('getActiveScope sets first scope from claims if existing is no longer in claims', () => {
    // arrange
    const storage = new ScopeStorage(new LocalStorageFake());

    const target = createTarget(
      localAccountId,
      true,
      clientId,
      actorScopesClaim,
      storage
    );

    storage.setActiveScope(localAccountId, 'actor3');

    // act
    const actual = target.getActiveScope();

    // assert
    expect(actual).toEqual('actor1');
    expect(storage.getActiveScope(localAccountId)).toEqual('actor1');
  });
});

function createTarget(
  localAccountId: string | null,
  grantFullAuthorization: boolean,
  clientId: string,
  actorScopes: string | null,
  store: ScopeStorage
) {
  const account: Partial<AccountInfo> | null = localAccountId
    ? {
        localAccountId: localAccountId ?? '',
        idTokenClaims: actorScopes
          ? { [`${actorScopesClaimsKey}`]: [actorScopes] }
          : {},
      }
    : null;

  const authResult: Partial<AuthenticationResult> = {
    account: account as AccountInfo,
  };

  const message: Partial<EventMessage> = {
    eventType: EventType.ACQUIRE_TOKEN_SUCCESS,
    payload: authResult as EventPayload,
  };

  const msalBroadcastService: Partial<MsalBroadcastService> = {
    msalSubject$: of(message as EventMessage),
  };

  const publicClientApplication: Partial<IPublicClientApplication> = {
    getAllAccounts: () => (localAccountId ? [account as AccountInfo] : []),
    setActiveAccount: () => ({}),
  };

  const msalService: Partial<MsalService> = {
    instance: publicClientApplication as IPublicClientApplication,
  };

  const featureFlagService: Partial<DhFeatureFlagsService> = {
    isEnabled: () => grantFullAuthorization,
  };

  const config = {
    authority: '',
    clientId: clientId,
    knownAuthorities: [],
  };

  return new ScopeService(
    config,
    msalBroadcastService as MsalBroadcastService,
    msalService as MsalService,
    featureFlagService as DhFeatureFlagsService,
    store
  );
}
