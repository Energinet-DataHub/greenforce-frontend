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
import {
  MarketParticipantUserRoleHttp,
  MarketParticipantActorViewDto,
} from '@energinet-datahub/dh/shared/domain';
import { firstValueFrom, Subject } from 'rxjs';
import { DhAdminUserRolesStore } from './dh-admin-user-roles.store';

describe('DhAdminUserRolesStore', () => {
  // Arrange
  const userRolesPrActor: MarketParticipantActorViewDto[] = [
    {
      id: '1',
      organizationName: 'Organization 1',
      actorNumber: '1',
      name: 'Actor 1',
      userRoles: [
        {
          id: '1',
          marketRole: 'BalanceResponsibleParty',
          name: 'Role 1',
          description: 'Beskrivelse rolle 1',
          userActorId: '1',
        },
      ],
    },
  ];

  test('should return user role view', async () => {
    const observable = new Subject<MarketParticipantActorViewDto[]>();

    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleViewGet: () => observable.asObservable(),
    } as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRolesStore(httpClient);

    store.getUserRolesView('1');
    observable.next(userRolesPrActor);
    observable.complete();

    // Act
    const result = await firstValueFrom(store.userRolesPrActor$);
    expect(result).toStrictEqual(userRolesPrActor);
  });

  test('complete with no errors', async () => {
    const observable = new Subject<MarketParticipantActorViewDto[]>();

    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleViewGet: () => observable.asObservable(),
    } as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRolesStore(httpClient);

    const spyOnCall = jest.spyOn(store.hasGeneralError$, 'next');

    store.getUserRolesView('1');
    observable.next(userRolesPrActor);
    observable.complete();

    // Act
    expect(spyOnCall).not.toHaveBeenCalled();
  });

  test('complete with errors', async () => {
    const observable = new Subject<MarketParticipantActorViewDto[]>();

    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleViewGet: () => observable.asObservable(),
    } as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRolesStore(httpClient);

    const spyOnCall = jest.spyOn(store.hasGeneralError$, 'next');

    store.getUserRolesView('1');
    observable.error('error');
    observable.complete();

    // Act
    expect(spyOnCall).toHaveBeenCalled();
  });
});
