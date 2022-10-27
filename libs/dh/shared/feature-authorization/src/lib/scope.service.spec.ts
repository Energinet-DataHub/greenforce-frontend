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
  EventMessage,
  EventType,
  IPublicClientApplication,
} from '@azure/msal-browser';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { of } from 'rxjs';
import { scopesKey } from '..';
import { scopeKey, ScopeService } from './scope.service';

describe('ScopeService.name', () => {
  const clientId = 'client_id';
  const localAccountId = 'local_account_id';
  const actorScopesClaim = 'actor1 actor2';

  test('should clear scopes from local storage, if no account is found', async () => {
    // arrange
    const remainingKey = 'other_key';
    const scopesKeyToBeRemoved = 'random_prefix' + scopesKey;
    const scopeKeyToBeRemoved = 'another_random_prefix' + scopeKey;

    const storage = new LocalStorageMock();

    storage.setItem(remainingKey, 'should not be cleared');
    storage.setItem(scopesKeyToBeRemoved, 'scopes');
    storage.setItem(scopeKeyToBeRemoved, 'scope');

    // act
    createTarget(null, true, 'clientId', null, storage);

    // assert
    expect(storage.getItem(remainingKey)).toBeTruthy();
    expect(storage.getItem(scopesKeyToBeRemoved)).toBeFalsy();
    expect(storage.getItem(scopeKeyToBeRemoved)).toBeFalsy();
  });

  test('should add actor scopes found in claims to local storage', async () => {
    // arrange
    const storage = new LocalStorageMock();

    // act
    createTarget(localAccountId, true, clientId, actorScopesClaim, storage);

    // assert
    expect(storage.getItem(localAccountId + scopesKey)).toEqual(
      actorScopesClaim
    );
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
        new LocalStorageMock()
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
        new LocalStorageMock()
      );

      // act
      const actual = target.getActiveScope();

      // assert
      expect(actual).toEqual(granFullAuthorizationEnabled ? clientId : '');
    }
  );

  test('getActiveScope returns existing activeScope if contianed in actor scopes from claims', () => {
    // arrange
    const storage = new LocalStorageMock();

    const target = createTarget(
      localAccountId,
      true,
      clientId,
      actorScopesClaim,
      storage
    );

    storage.setItem(localAccountId + scopeKey, 'actor2');

    // act
    const actual = target.getActiveScope();

    // assert
    expect(actual).toEqual('actor2');
  });

  test('getActiveScope sets first scope from claims if existing is no longer in claims', () => {
    // arrange
    const storage = new LocalStorageMock();

    const target = createTarget(
      localAccountId,
      true,
      clientId,
      actorScopesClaim,
      storage
    );

    storage.setItem(localAccountId + scopeKey, 'actor3');

    // act
    const actual = target.getActiveScope();

    // assert
    expect(actual).toEqual('actor1');
    expect(storage.getItem(localAccountId + scopeKey)).toEqual('actor1');
  });
});

class LocalStorageMock {
  store: { [key: string]: string } = {};

  length = 0;

  setItem = (key: string, value: string) => {
    this.store[key] = value;
    this.length = Object.keys(this.store).length;
  };

  getItem = (key: string) => {
    return this.store[key];
  };

  removeItem = (key: string) => {
    delete this.store[key];
    this.length = Object.keys(this.store).length;
  };

  key = (index: number) => {
    return Object.keys(this.store).at(index) ?? null;
  };
}

function createTarget(
  localAccountId: string | null,
  grantFullAuthorization: boolean,
  clientId: string,
  actorScopes: string | null,
  store: LocalStorageMock
) {
  const message: Partial<EventMessage> = {
    eventType: EventType.LOGIN_SUCCESS,
  };

  const msalBroadcastService: Partial<MsalBroadcastService> = {
    msalSubject$: of(message as EventMessage),
  };

  const account: Partial<AccountInfo> = {
    localAccountId: localAccountId ?? '',
    idTokenClaims: actorScopes ? { 'extn.actors': [actorScopes] } : {},
  };

  const publicClientApplication: Partial<IPublicClientApplication> = {
    getAllAccounts: () => (localAccountId ? [account as AccountInfo] : []),
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
