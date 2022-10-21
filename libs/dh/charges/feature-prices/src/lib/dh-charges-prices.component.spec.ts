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
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { MatNativeDateModule } from '@angular/material/core';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { HttpClientModule } from '@angular/common/http';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
  DhChargesPricesScam,
  DhChargesPricesComponent,
} from './dh-charges-prices.component';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

describe('DhChargesPricesComponent', () => {
  async function setup() {
    const { fixture } = await render(DhChargesPricesComponent, {
      imports: [
        getTranslocoTestingModule(),
        MatNativeDateModule,
        DhApiModule.forRoot(),
        HttpClientModule,
        DhChargesPricesScam,
      ],
    });

    return {
      fixture,
    };
  }

  it('should fetch and render data on submit', async () => {
    await setup();

    const searchButton = screen.getByRole('button', { name: /search/i });

    userEvent.click(searchButton);

    const id = await waitFor(() =>
      screen.getByRole('cell', { name: /0AA1F/i })
    );

    expect(id).toBeInTheDocument();
  });

  it('should empty all input fields and result on reset', async () => {
    await setup();

    const idInputField = screen.getByLabelText(/price id\/name/i, {
      suggest: false,
    });

    userEvent.type(idInputField, 'test 123');

    expect(idInputField).toHaveValue('test 123');

    const resetButton = screen.getByRole('button', { name: /clear/i });
    userEvent.click(resetButton);

    expect(idInputField).toHaveValue('');

    const searchTextLabel = screen.getByText(
      enTranslations.charges.prices.startSearchText
    );
    expect(searchTextLabel).toBeInTheDocument();
  });

  it('should open a drawer when clicking on row', async () => {
    await setup();

    const searchButton = screen.getByRole('button', { name: /search/i });

    userEvent.click(searchButton);

    const id = await waitFor(() =>
      screen.getByRole('cell', { name: /0AA1F/i })
    );

    expect(id).toBeInTheDocument();
    userEvent.click(id);

    const drawer = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === 'watt-drawer'
    );

    expect(drawer).toBeInTheDocument();
  });

  it('when drawer is open, date range should be set', async () => {
    await setup();

    const searchButton = screen.getByRole('button', { name: /search/i });

    userEvent.click(searchButton);

    const id = await waitFor(() =>
      screen.getByRole('cell', { name: /0AA1F/i })
    );

    expect(id).toBeInTheDocument();
    userEvent.click(id);

    const drawer = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === 'watt-drawer'
    );

    expect(drawer).toBeInTheDocument();

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });

    expect(startDateInput).toBeInTheDocument();

    const expectedDate = new Date().toLocaleDateString();
    const actualDateInput = new Date(startDateInput.value).toLocaleDateString();

    expect(actualDateInput).toEqual(expectedDate);
  });

  it.todo('should clear valid from and valid to when selecting validity');
  it.todo('should clear "user defined" in validity when entering valid dates');
});
