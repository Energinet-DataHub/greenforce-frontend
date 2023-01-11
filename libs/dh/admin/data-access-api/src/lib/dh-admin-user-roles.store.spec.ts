import {
  MarketParticipantUserRoleHttp,
  UserRoleView,
} from '@energinet-datahub/dh/shared/domain';
import { firstValueFrom, Subject } from 'rxjs';
import { DhAdminUserRolesStore } from './dh-admin-user-roles.store';

describe('DhAdminUserRolesStore', () => {
  // Arrange
  const userRoleView = {
    organizations: [
      {
        id: '1',
        name: 'Organization 1',
        actors: [
          {
            id: '1',
            actorNumber: '1',
            name: 'Actor 1',
            userRoles: [
              {
                id: '1',
                name: 'Role 1',
                userActorId: '1',
              },
            ],
          },
        ],
      },
    ],
  } as UserRoleView;

  test('should return user role view', async () => {
    const observable = new Subject<UserRoleView>();

    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleViewGet: () =>
        observable.asObservable(),
    } as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRolesStore(httpClient);

    store.getUserRoleView('1');
    observable.next(userRoleView);
    observable.complete();

    // Act
    const result = await firstValueFrom(store.userRoleView$);
    expect(result).toStrictEqual(userRoleView);
  });

  test('complete with no errors', async () => {
    const observable = new Subject<UserRoleView>();

    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleViewGet: () =>
        observable.asObservable(),
    } as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRolesStore(httpClient);

    store.getUserRoleView('1');
    observable.next(userRoleView);
    observable.complete();

    // Act
    const result = await firstValueFrom(store.hasGeneralError$);
    expect(result).toBeFalsy();
  });

  test('complete with errors', async () => {
    const observable = new Subject<UserRoleView>();

    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleViewGet: () =>
        observable.asObservable(),
    } as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRolesStore(httpClient);

    store.getUserRoleView('1');
    observable.error('error');
    observable.complete();

    // Act
    const result = await firstValueFrom(store.hasGeneralError$);
    expect(result).toBeTruthy();
  });
});
