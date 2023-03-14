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
import { ChargeTypes } from '@energinet-datahub/dh/charges/domain';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DanishLocaleModule } from '@energinet-datahub/gf/configuration-danish-locale';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { formatInTimeZone } from 'date-fns-tz';
import { WattToastModule } from '@energinet-datahub/watt/toast';
import {
  DhChargesCreatePricesComponent,
  DhChargesCreatePricesScam,
} from './dh-charges-create-prices.component';

const dateTimeFormat = 'dd-MM-yyyy';
const danishTimeZoneIdentifier = 'Europe/Copenhagen';
const chargeTypeDropdownName = 'charge type';
const resolutionDropdownName = 'resolution';

describe(DhChargesCreatePricesComponent.name, () => {
  function findInputElement(selector: string) {
    const element: HTMLInputElement = screen.getByRole('textbox', {
      name: new RegExp(`${selector}`, 'i'),
    });

    return element;
  }

  function findDropdownElement(selector: string) {
    const element: HTMLSelectElement = screen.getByRole('combobox', {
      name: new RegExp(`${selector}`, 'i'),
    });

    return element;
  }

  function findCheckboxElement(selector: string) {
    const element: HTMLInputElement = screen.getByRole('checkbox', {
      name: new RegExp(`${selector}`, 'i'),
    });

    return element;
  }

  async function setup() {
    const { fixture } = await render(DhChargesCreatePricesComponent, {
      imports: [
        getTranslocoTestingModule(),
        DhApiModule.forRoot(),
        HttpClientModule,
        WattDanishDatetimeModule.forRoot(),
        WattToastModule.forRoot(),
        DanishLocaleModule,
        DhChargesCreatePricesScam,
      ],
    });

    return {
      fixture,
    };
  }

  it('default effectiveDate should be today plus 31 days', async () => {
    await setup();

    const effectiveDateInput = findInputElement('date-input');

    expect(effectiveDateInput).toBeInTheDocument();

    const now = new Date();
    now.setDate(now.getDate() + 31);
    const expectedDate = formatInTimeZone(now, danishTimeZoneIdentifier, dateTimeFormat);
    expect(effectiveDateInput.value).toEqual(expectedDate);
  });

  it('when selecting subscription charge type, resolution should be Month', async () => {
    await setup();

    const chargeTypeDropdown = findDropdownElement(chargeTypeDropdownName);
    const resolutionDropdown = findDropdownElement(resolutionDropdownName);
    const chargeType = ChargeTypes[ChargeTypes.Subscription];

    expect(chargeTypeDropdown).toBeInTheDocument();
    expect(resolutionDropdown).toBeInTheDocument();

    userEvent.click(chargeTypeDropdown);

    const option = await waitFor(() => screen.getByText(chargeType));
    userEvent.click(option);

    expect(chargeTypeDropdown.textContent).toBe(chargeType);
    expect(resolutionDropdown.textContent).toBe('Month');

    expect(screen.queryByText(/tax/i)).not.toBeInTheDocument();
  });

  it('when selecting Fee charge type, resolution should be Month, transparent invoicing false, and VAT true', async () => {
    await setup();

    const chargeTypeDropdown = findDropdownElement(chargeTypeDropdownName);
    const resolutionDropdown = findDropdownElement(resolutionDropdownName);
    const chargeType = ChargeTypes[ChargeTypes.Fee];

    expect(chargeTypeDropdown).toBeInTheDocument();
    expect(resolutionDropdown).toBeInTheDocument();

    userEvent.click(chargeTypeDropdown);

    const option = await waitFor(() => screen.getByText(chargeType));
    userEvent.click(option);

    expect(chargeTypeDropdown.textContent).toBe(chargeType);
    expect(resolutionDropdown.textContent).toBe('Month');

    const transparentInvoicingCheckbox = findCheckboxElement('transparent invoicing');
    expect(transparentInvoicingCheckbox).toBeInTheDocument();
    expect(transparentInvoicingCheckbox.checked).toBe(false);
    expect(transparentInvoicingCheckbox).toBeDisabled();

    const vatCheckbox = findCheckboxElement('vat');
    expect(vatCheckbox).toBeInTheDocument();
    expect(vatCheckbox.checked).toBe(true);

    expect(screen.queryByText(/tax/i)).not.toBeInTheDocument();
  });

  it('when selecting Tariff charge type, resolution should not be selected', async () => {
    await setup();

    const chargeTypeDropdown = findDropdownElement(chargeTypeDropdownName);
    const resolutionDropdown = findDropdownElement(resolutionDropdownName);
    const chargeType = ChargeTypes[ChargeTypes.Tariff];

    expect(chargeTypeDropdown).toBeInTheDocument();
    expect(resolutionDropdown).toBeInTheDocument();

    userEvent.click(chargeTypeDropdown);

    const option = await waitFor(() => screen.getByText(chargeType));
    userEvent.click(option);

    expect(chargeTypeDropdown.textContent).toBe(chargeType);
    expect(resolutionDropdown.textContent).toBe('Select resolution');
  });
});
