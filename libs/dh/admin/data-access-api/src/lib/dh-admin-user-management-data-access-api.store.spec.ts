import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { firstValueFrom } from 'rxjs';

import {
  DhAdminUserManagementDataAccessApiStore,
  initialState,
} from './dh-admin-user-management-data-access-api.store';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import {
  UserOverviewSearchDocument,
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

  describe('selectors', () => {
    it('paginatorPageIndex$', async () => {
      const { store } = await setup();

      const op = controller.expectOne(UserOverviewSearchDocument);

      expect(op.operation.variables['pageNumber']).toBe(1);

      const actualValue = await firstValueFrom(store.paginatorPageIndex$);

      expect(actualValue).toBe(0);
    });
  });
});
