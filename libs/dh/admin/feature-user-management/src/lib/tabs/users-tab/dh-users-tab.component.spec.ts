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
import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import {
  MarketParticipantUserOverviewItemDto,
  MarketParticipantUserStatus,
} from '@energinet-datahub/dh/shared/domain';

import { DhUsersTabComponent } from './dh-users-tab.component';
import { searchDebounceTimeMs } from '@energinet-datahub/dh/shared/ui-search';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { FormGroupDirective } from '@angular/forms';

const users: MarketParticipantUserOverviewItemDto[] = [
  {
    id: '3ec41d91-fc6d-4364-ade6-b85576a91d04',
    email: 'testuser1@test.dk',
    firstName: 'Test User First',
    lastName: 'Test User Last',
    phoneNumber: '11111111',
    createdDate: '2022-01-01T23:00:00Z',
    status: 'Active',
    assignedActors: [],
  },
];

describe(DhUsersTabComponent, () => {
  async function setup(mockUsers: MarketParticipantUserOverviewItemDto[] = []) {
    const storeMock = MockProvider(
      DhAdminUserManagementDataAccessApiStore,
      {
        users$: of(mockUsers),
        isLoading$: of(false),
        updateSearchText: jest.fn(),
        updateStatusFilter: jest.fn(),
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

    const { fixture } = await render(DhUsersTabComponent, {
      imports: [getTranslocoTestingModule(), HttpClientModule, DhApiModule.forRoot()],
      providers: [FormGroupDirective],
      componentProviders: [storeMock, toastServiceMock],
    });

    const store = TestBed.inject(DhAdminUserManagementDataAccessApiStore);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const matSelect = await loader.getHarness(MatSelectHarness);

    return {
      fixture,
      store,
      matSelect,
    };
  }

  it('displays user data', async () => {
    await setup(users);

    const [testUser] = users;

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
      name: new RegExp(enTranslations.admin.userManagement.userStatus.active, 'i'),
    });

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  });

  it('forwards search input value to store', fakeAsync(async () => {
    const { store } = await setup();

    const inputValue = 'test';
    const searchInput = screen.getByRole('textbox');

    userEvent.type(searchInput, inputValue);
    tick(searchDebounceTimeMs);

    expect(store.updateSearchText).toHaveBeenCalledWith(inputValue);
  }));

  it('forwards status filter value to store', fakeAsync(async () => {
    const { store, matSelect } = await setup();

    await matSelect.open();
    const options = await matSelect.getOptions();

    for (const option of options) {
      // Skip empty placeholder.
      if ((await option.getText()) === '') continue;
      await option.click();
    }

    const allOptions = Object.keys(MarketParticipantUserStatus);
    expect(store.updateStatusFilter).toHaveBeenCalledWith(allOptions);
  }));
});
