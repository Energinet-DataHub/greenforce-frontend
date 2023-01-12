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
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';
import { MockProvider } from 'ng-mocks';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';

import { DhUsersTabComponent } from './dh-users-tab.component';
import { searchDebounceTimeMs } from './dh-users-tab-search.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

describe('DhUsersTabComponent.name', () => {
  async function setup() {
    const storeMock = MockProvider(
      DhAdminUserManagementDataAccessApiStore,
      {
        updateSearchText: jest.fn(),
        updateStatusFilter: jest.fn(),
      },
      'useValue'
    );

    const { fixture } = await render(DhUsersTabComponent, {
      imports: [
        getTranslocoTestingModule(),
        HttpClientModule,
        DhApiModule.forRoot(),
      ],
      componentProviders: [storeMock],
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

    // TODO: Use list.
    await options[1].click();
    await options[2].click();

    expect(store.updateStatusFilter).toHaveBeenCalledWith([
      'Active',
      'Inactive',
    ]);
  }));
});
