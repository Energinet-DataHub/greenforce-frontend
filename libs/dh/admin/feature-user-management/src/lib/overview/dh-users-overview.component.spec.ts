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
import { FormGroupDirective } from '@angular/forms';
import { signal } from '@angular/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';

import { DhUsers } from '@energinet-datahub/dh/admin/shared';
import { UserStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { MsalServiceMock } from '@energinet-datahub/dh/shared/test-util-auth';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import {
  DhAdminUserManagementDataAccessApiStore,
  DhUserManagementFilters,
} from '@energinet-datahub/dh/admin/data-access-api';

import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhUsersOverviewComponent, debounceTimeValue } from './dh-users-overview.component';

const users: DhUsers = [
  {
    __typename: 'User',
    id: '3ec41d91-fc6d-4364-ade6-b85576a91d04',
    email: 'testuser1@test.dk',
    firstName: 'Test User First',
    lastName: 'Test User Last',
    phoneNumber: '11111111',
    status: UserStatus.Active,
    createdDate: new Date(),
    actors: [],
  },
];

describe(DhUsersOverviewComponent, () => {
  async function setup(mockUsers: DhUsers = []) {
    const storeMock = MockProvider(
      DhAdminUserManagementDataAccessApiStore,
      {
        users$: of(mockUsers),
        isLoading$: of(false),
        updateSearchText: jest.fn(),
        updateFilters: jest.fn(),
        isDownloading: signal(false),
      },
      'useValue'
    );

    const toastServiceMock = MockProvider(
      WattToastService,
      {
        open: jest.fn(),
      },
      'useValue'
    );

    const { fixture } = await render(DhUsersOverviewComponent, {
      imports: [getTranslocoTestingModule(), ApolloTestingModule],
      providers: [FormGroupDirective, MsalServiceMock, provideHttpClient(withInterceptorsFromDi())],
      componentProviders: [storeMock, toastServiceMock],
    });

    const store = TestBed.inject(DhAdminUserManagementDataAccessApiStore);

    const statusFilterBtn = screen.getByRole('button', {
      name: new RegExp(enTranslations.admin.userManagement.tabs.users.filter.status),
      pressed: false,
    });

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const matSelect = await loader.getHarness(MatSelectHarness);

    return {
      fixture,
      store,
      matSelect,
      statusFilterBtn,
    };
  }

  it('displays user data', fakeAsync(async () => {
    await setup(users);

    const [testUser] = users;

    tick(debounceTimeValue);

    const firstName = screen.getByRole('gridcell', {
      name: new RegExp(testUser.firstName, 'i'),
    });
    const lastName = screen.getByRole('gridcell', {
      name: new RegExp(testUser.lastName, 'i'),
    });
    const email = screen.getByRole('gridcell', {
      name: new RegExp(testUser.email, 'i'),
    });
    const phone = screen.getByRole('gridcell', {
      name: new RegExp(testUser.phoneNumber ?? '', 'i'),
    });
    const status = screen.getByRole('gridcell', {
      name: new RegExp(enTranslations.admin.userManagement.userStatus.ACTIVE, 'i'),
    });

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  }));

  it('forwards search input value to store', fakeAsync(async () => {
    const { store } = await setup();

    const inputValue = 'test';
    const searchInput = screen.getByRole('searchbox');

    userEvent.type(searchInput, inputValue);
    tick(debounceTimeValue);

    expect(store.updateSearchText).toHaveBeenCalledWith(inputValue);
  }));

  it('forwards filters to store', fakeAsync(async () => {
    const { store, matSelect, statusFilterBtn } = await setup();

    userEvent.click(statusFilterBtn);

    const options = await matSelect.getOptions();

    for (const option of options) {
      // Skip empty placeholder.
      if ((await option.getText()) === '') continue;

      await option.click();
    }

    tick(debounceTimeValue);

    const actualValue: DhUserManagementFilters = {
      actorId: null,
      status: Object.values(UserStatus) as UserStatus[],
      userRoleIds: null,
    };
    expect(store.updateFilters).toHaveBeenCalledWith(actualValue);
  }));
});
