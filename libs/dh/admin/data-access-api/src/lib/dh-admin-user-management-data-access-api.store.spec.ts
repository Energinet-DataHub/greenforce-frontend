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
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { firstValueFrom, of } from 'rxjs';

import {
  MarketParticipantUserOverviewHttp,
  MarketParticipantUserStatus,
  MarketParticipantUserOverviewFilterDto,
} from '@energinet-datahub/dh/shared/domain';

import { DhAdminUserManagementDataAccessApiStore } from './dh-admin-user-management-data-access-api.store';

describe(DhAdminUserManagementDataAccessApiStore, () => {
  async function setup() {
    const httpMock = {
      v1MarketParticipantUserOverviewSearchUsersPost: jest.fn(() => of()),
    } as unknown as MarketParticipantUserOverviewHttp;

    @Component({
      template: '',
    })
    class TestComponent {}

    await render(TestComponent, {
      providers: [
        provideComponentStore(DhAdminUserManagementDataAccessApiStore),
        {
          provide: MarketParticipantUserOverviewHttp,
          useValue: httpMock,
        },
      ],
    });

    const store = TestBed.inject(DhAdminUserManagementDataAccessApiStore);

    return {
      store,
      httpMock,
    };
  }

  it('calls the API on initialization with default params', async () => {
    const { httpMock } = await setup();

    const filterDto: MarketParticipantUserOverviewFilterDto = {
      actorId: undefined,
      userRoleIds: [],
      searchText: undefined,
      userStatus: ['Active', 'Invited', 'InviteExpired'],
    };

    const actualParams = {
      pageNumber: 1,
      pageSize: 50,
      sortProperty: 'Email',
      direction: 'Asc',
      filterDto,
    };

    expect(httpMock.v1MarketParticipantUserOverviewSearchUsersPost).toHaveBeenCalledWith(
      ...Object.values(actualParams)
    );
  });

  it(`when the page metadata is updated,
  then the API is called`, fakeAsync(async () => {
    const { httpMock, store } = await setup();

    const newPageMetadata = {
      pageIndex: 3,
      pageSize: 25,
    };

    store.updatePageMetadata(newPageMetadata);

    tick();

    const filterDto: MarketParticipantUserOverviewFilterDto = {
      actorId: undefined,
      userRoleIds: [],
      searchText: undefined,
      userStatus: ['Active', 'Invited', 'InviteExpired'],
    };

    const actualParams = {
      pageNumber: 4,
      pageSize: 25,
      sortProperty: 'Email',
      direction: 'Asc',
      filterDto,
    };

    expect(httpMock.v1MarketParticipantUserOverviewSearchUsersPost).toHaveBeenLastCalledWith(
      ...Object.values(actualParams)
    );
  }));

  it(`when the search text is updated,
  then the API is called`, fakeAsync(async () => {
    const { httpMock, store } = await setup();

    store.updateSearchText('john');

    tick();

    const filterDto: MarketParticipantUserOverviewFilterDto = {
      actorId: undefined,
      userRoleIds: [],
      searchText: 'john',
      userStatus: ['Active', 'Invited', 'InviteExpired'],
    };

    const actualParams = {
      pageNumber: 1,
      pageSize: 50,
      sortProperty: 'Email',
      direction: 'Asc',
      filterDto,
    };

    expect(httpMock.v1MarketParticipantUserOverviewSearchUsersPost).toHaveBeenLastCalledWith(
      ...Object.values(actualParams)
    );
  }));

  it(`when the status filter is updated,
  then the API is called`, fakeAsync(async () => {
    const { httpMock, store } = await setup();

    const newStatusFilters: MarketParticipantUserStatus[] = ['Active', 'Inactive'];

    store.updateStatusFilter(newStatusFilters);

    tick();

    const filterDto: MarketParticipantUserOverviewFilterDto = {
      actorId: undefined,
      userRoleIds: [],
      searchText: undefined,
      userStatus: ['Active', 'Inactive'],
    };

    const actualParams = {
      pageNumber: 1,
      pageSize: 50,
      sortProperty: 'Email',
      direction: 'Asc',
      filterDto,
    };

    expect(httpMock.v1MarketParticipantUserOverviewSearchUsersPost).toHaveBeenLastCalledWith(
      ...Object.values(actualParams)
    );
  }));

  it(`when the reloadUsers method is called,
  then the API is called`, fakeAsync(async () => {
    const { httpMock, store } = await setup();

    store.reloadUsers();

    tick();

    // 1. Initial call
    // 2. When `reloadUsers` is called
    const numberOfTimesCalled = 2;

    expect(httpMock.v1MarketParticipantUserOverviewSearchUsersPost).toHaveBeenCalledTimes(
      numberOfTimesCalled
    );
  }));

  describe('selectors', () => {
    it('paginatorPageIndex$', async () => {
      const { store } = await setup();

      const actualValue = await firstValueFrom(store.paginatorPageIndex$);

      expect(actualValue).toBe(0);
    });
  });
});
