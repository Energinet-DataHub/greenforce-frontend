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
  asyncScheduler,
  firstValueFrom,
  Observable,
  of,
  scheduled,
} from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

import {
  MarketParticipantUserRoleHttp,
  UserRoleAuditLogsDto,
} from '@energinet-datahub/dh/shared/domain';

import { DhAdminUserRoleAuditLogsDataAccessApiStore } from './dh-admin-user-role-audit-logs-data-access-api.store';

const testUserRoleId = 'ff029a48-b06f-4300-8ec0-84d121a4b83f';
const mockResponse: UserRoleAuditLogsDto = {
  auditLogs: [
    {
      userRoleId: '',
      changedByUserId: '',
      changedByUserName: '',
      timestamp: '',
      userRoleChangeType: 'Created',
      changeDescriptionJson: '',
    },
  ],
};

const scheduleObservable = (value: Observable<UserRoleAuditLogsDto>) => {
  return scheduled(value, asyncScheduler);
};

describe('DhAdminUserRoleAuditLogsDataAccessApiStore.name', () => {
  it('calls the API with correct param', () => {
    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleAuditLogsGet: jest.fn(() =>
        scheduleObservable(of(mockResponse))
      ),
    } as unknown as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRoleAuditLogsDataAccessApiStore(httpClient);
    store.getAuditLogs(of(testUserRoleId));

    expect(
      httpClient.v1MarketParticipantUserRoleGetUserRoleAuditLogsGet
    ).toHaveBeenCalledWith(testUserRoleId);
  });

  test('`auditLogs$` should always return an empty array', fakeAsync(async () => {
    const httpClient = {
      v1MarketParticipantUserRoleGetUserRoleAuditLogsGet: jest.fn(() =>
        scheduleObservable(of(mockResponse))
      ),
    } as unknown as MarketParticipantUserRoleHttp;

    const store = new DhAdminUserRoleAuditLogsDataAccessApiStore(httpClient);
    store.getAuditLogs(of(testUserRoleId));

    tick();

    const actualValue = await firstValueFrom(store.auditLogs$);

    expect(actualValue).toStrictEqual([]);
    expect(
      httpClient.v1MarketParticipantUserRoleGetUserRoleAuditLogsGet
    ).toHaveBeenCalled();
  }));
});
