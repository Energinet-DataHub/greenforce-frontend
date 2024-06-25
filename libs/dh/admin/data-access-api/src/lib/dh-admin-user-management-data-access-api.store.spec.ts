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
  DhAdminUserManagementDataAccessApiStore,
  initialState,
} from './dh-admin-user-management-data-access-api.store';
import { Apollo } from 'apollo-angular';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import {
  MarketParticipantSortDirctionType,
  UserOverviewSearchDocument,
  UserOverviewSearchQueryVariables,
  UserOverviewSortProperty,
  UserStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

describe(DhAdminUserManagementDataAccessApiStore, () => {
  let controller: ApolloTestingController;

  afterEach(() => {
    controller.verify();
  });

  async function setup() {
    @Component({
      template: '',
    })
    class TestComponent {}

    await render(TestComponent, {
      imports: [ApolloTestingModule],
      providers: [provideComponentStore(DhAdminUserManagementDataAccessApiStore)],
    });

    controller = TestBed.inject(ApolloTestingController);
    const store = TestBed.inject(DhAdminUserManagementDataAccessApiStore);

    return {
      store,
      controller,
    };
  }

  it('calls the API on initialization with default params', async () => {
    const { controller } = await setup();

    const op = controller.expectOne(UserOverviewSearchDocument);

    const {
      pageSize,
      pageNumber,
      sortProperty,
      direction,
      actorIdFilter,
      userRoleFilter,
      statusFilter,
      searchText,
    } = initialState;

    const filterDto = {
      pageNumber,
      pageSize,
      sortProperty,
      sortDirection: direction,
      actorId: actorIdFilter,
      userRoleIds: userRoleFilter,
      searchText,
      userStatus: statusFilter,
    };

    expect(op.operation.variables).toEqual(filterDto);
  });

  it(`when the page metadata is updated,
  then the API is called`, fakeAsync(async () => {
    const { controller, store } = await setup();

    const newPageMetadata = {
      pageIndex: 3,
      pageSize: 25,
    };

    store.updatePageMetadata(newPageMetadata);

    tick();

    const op = controller.match(UserOverviewSearchDocument);

    const { sortProperty, direction, actorIdFilter, userRoleFilter, statusFilter, searchText } =
      initialState;

    const filterDto = {
      pageNumber: 4,
      pageSize: 25,
      sortProperty,
      sortDirection: direction,
      actorId: actorIdFilter,
      userRoleIds: userRoleFilter,
      searchText,
      userStatus: statusFilter,
    };

    const variablesFromSecondCall = op[1].operation.variables;

    expect(variablesFromSecondCall).toEqual(filterDto);
  }));

  it(`when the search text is updated,
  then the API is called`, fakeAsync(async () => {
    const { controller, store } = await setup();

    const searchText = 'john';

    store.updateSearchText(searchText);

    tick();

    const op = controller.match(UserOverviewSearchDocument);

    const {
      pageSize,
      pageNumber,
      sortProperty,
      direction,
      actorIdFilter,
      userRoleFilter,
      statusFilter,
    } = initialState;

    const filterDto = {
      pageNumber,
      pageSize,
      sortProperty,
      sortDirection: direction,
      actorId: actorIdFilter,
      userRoleIds: userRoleFilter,
      searchText,
      userStatus: statusFilter,
    };

    const variablesFromSecondCall = op[1].operation.variables;

    expect(variablesFromSecondCall).toEqual(filterDto);
  }));

  it(`when the filters are updated,
  then the API is called`, fakeAsync(async () => {
    const { controller, store } = await setup();

    const newStatusFilters: UserStatus[] = [UserStatus.Active, UserStatus.Inactive];

    store.updateFilters({ status: newStatusFilters, actorId: null, userRoleIds: [] });

    tick();

    const op = controller.match(UserOverviewSearchDocument);

    const {
      pageSize,
      pageNumber,
      sortProperty,
      direction,
      actorIdFilter,
      userRoleFilter,
      searchText,
    } = initialState;

    const filterDto = {
      pageNumber,
      pageSize,
      sortProperty,
      sortDirection: direction,
      actorId: actorIdFilter,
      userRoleIds: userRoleFilter,
      searchText,
      userStatus: newStatusFilters,
    };

    const variablesFromSecondCall = op[1].operation.variables;

    expect(variablesFromSecondCall).toEqual(filterDto);
  }));

  it(`when the reloadUsers method is called,
  then the API is called`, fakeAsync(async () => {
    const { controller, store } = await setup();

    const op = controller.match(UserOverviewSearchDocument);

    op[0].flush({
      data: {
        dog: {
          id: 0,
          name: 'Mr Apollo',
          breed: 'foo',
        },
      },
    });

    tick(1000);

    store.reloadUsers();

    tick(1000);

    console.log(op);

    // 1. Initial call
    // 2. When `reloadUsers` is called
    const numberOfTimesCalled = 2;

    expect(op.length).toEqual(numberOfTimesCalled);
  }));

  describe('selectors', () => {
    it('paginatorPageIndex$', async () => {
      const { store } = await setup();

      const actualValue = await firstValueFrom(store.paginatorPageIndex$);

      expect(actualValue).toBe(0);
    });
  });
});
