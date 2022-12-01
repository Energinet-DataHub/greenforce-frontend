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
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { HttpClientModule } from '@angular/common/http';
import { formatInTimeZone } from 'date-fns-tz';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import {
  ChargeType,
  ChargeV1Dto,
  Resolution,
  VatClassification,
} from '@energinet-datahub/dh/shared/domain';
import userEvent from '@testing-library/user-event';
import { DhMarketParticipantDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { DanishLocaleModule } from '@energinet-datahub/gf/configuration-danish-locale';
import { add } from 'date-fns';
import { TestBed } from '@angular/core/testing';
import { DhChargeContentComponent } from './dh-charge-content.component';
import { DrawerDatepickerService } from './drawer-datepicker/drawer-datepicker.service';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

const dateTimeFormat = 'dd-MM-yyyy';
const timeZoneIdentifier = 'Europe/Copenhagen';

const charge: ChargeV1Dto = {
  id: '6AA831CF-14F8-41D5-8E08-26939172DFAA',
  chargeType: ChargeType.D02,
  resolution: Resolution.P1D,
  taxIndicator: false,
  transparentInvoicing: true,
  vatClassification: VatClassification.NoVat,
  validFromDateTime: '2021-09-29T22:00:00Z',
  validToDateTime: '2021-10-29T22:00:00Z',
  chargeId: 'chargeid01',
  chargeName: 'Net abo A høj Forbrug 3',
  chargeDescription: 'Net abo A høj Forbrug 2 beskrivelse',
  chargeOwner: '5790000681074',
  chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 042',
  hasAnyPrices: true,
};

const startDateInputSelector = 'start-date-input';
const endDateInputSelector = 'end-date-input';

describe(DhChargeContentComponent.name, () => {
  function findInputElement(selector: string) {
    const element: HTMLInputElement = screen.getByRole('textbox', {
      name: new RegExp(`${selector}`, 'i'),
    });

    return element;
  }

  async function setup() {
    const { fixture } = await render(DhChargeContentComponent, {
      providers: [DhMarketParticipantDataAccessApiStore],
      componentProviders: [
        {
          provide: DrawerDatepickerService,
          useValue: new DrawerDatepickerService(),
        },
      ],
      imports: [
        DhChargeContentComponent,
        getTranslocoTestingModule(),
        WattDanishDatetimeModule.forRoot(),
        DanishLocaleModule,
        HttpClientModule,
        DhApiModule.forRoot(),
      ],
    });

    fixture.componentInstance.charge = charge;

    const datepickerService = TestBed.inject(DrawerDatepickerService);

    return {
      fixture,
      datepickerService,
    };
  }

  it('price tab should be active by default', async () => {
    await setup();

    const priceTab = screen.getByRole('tab', { name: /prices/i });

    expect(priceTab).toBeInTheDocument();
    expect(priceTab).toHaveClass('mat-tab-label-active');
  });

  it('displays a date range', async () => {
    await setup();

    const startDateInput = await waitFor(() =>
      findInputElement(startDateInputSelector)
    );
    const endDateInput = await waitFor(() =>
      findInputElement(endDateInputSelector)
    );

    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  it.skip('date range should default to today', async () => {
    await setup();

    const startDateInput = await waitFor(() =>
      findInputElement(startDateInputSelector)
    );
    const endDateInput = await waitFor(() =>
      findInputElement(endDateInputSelector)
    );

    const now = new Date();
    const expectedDate = formatInTimeZone(
      now,
      timeZoneIdentifier,
      dateTimeFormat
    );

    expect(startDateInput.value).toEqual(expectedDate);
    expect(endDateInput.value).toEqual(expectedDate);
  });

  it.skip('when date range is updated, it should stay the same across all tabs', async () => {
    const { fixture } = await setup();

    const now = new Date();
    const tomorrow = add(now, { days: 1 });

    let startDateInput = await waitFor(() =>
      findInputElement(startDateInputSelector)
    );
    let endDateInput = await waitFor(() =>
      findInputElement(endDateInputSelector)
    );

    const newDateToInput = formatInTimeZone(
      tomorrow,
      timeZoneIdentifier,
      'ddMMyyyy'
    );

    userEvent.clear(startDateInput);
    startDateInput.setSelectionRange(0, 0);
    userEvent.type(startDateInput, newDateToInput);
    fireEvent.blur(startDateInput);

    userEvent.clear(endDateInput);
    endDateInput.setSelectionRange(0, 0);
    userEvent.type(endDateInput, newDateToInput);
    fireEvent.blur(endDateInput);

    startDateInput = findInputElement(startDateInputSelector);
    endDateInput = findInputElement(endDateInputSelector);

    const expectedNewDate = formatInTimeZone(
      tomorrow,
      timeZoneIdentifier,
      dateTimeFormat
    );

    expect(startDateInput.value).toEqual(expectedNewDate);
    expect(endDateInput.value).toEqual(expectedNewDate);

    const messageTab = screen.getByRole('tab', { name: /messages/i });
    expect(messageTab).toBeInTheDocument();

    userEvent.click(messageTab);
    expect(messageTab).toHaveClass('mat-tab-label-active');

    await runOnPushChangeDetection(fixture);

    startDateInput = findInputElement(startDateInputSelector);
    endDateInput = findInputElement(endDateInputSelector);

    expect(startDateInput.value).toEqual(expectedNewDate);
    expect(endDateInput.value).toEqual(expectedNewDate);
  });
});
