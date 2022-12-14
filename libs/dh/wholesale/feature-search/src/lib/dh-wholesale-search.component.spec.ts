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
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { WattToastModule } from '@energinet-datahub/watt/toast';

import { DhWholesaleSearchComponent } from './dh-wholesale-search.component';
import { WattTopBarOutletComponent } from 'libs/ui-watt/src/lib/components/shell/top-bar';

async function setup() {
  await render(
    `<watt-top-bar-outlet></watt-top-bar-outlet><dh-wholesale-search></dh-wholesale-search>`,
    {
      imports: [
        DhApiModule.forRoot(),
        DhWholesaleSearchComponent,
        getTranslocoTestingModule(),
        HttpClientModule,
        WattDanishDatetimeModule.forRoot(),
        WattToastModule.forRoot(),
        WattTopBarOutletComponent,
      ],
    }
  );
}

describe(DhWholesaleSearchComponent.name, () => {
  it('should show period with initial value', async () => {
    await setup();
    expect(screen.getAllByText('Execution time')[0]).toBeInTheDocument();
  });

  it('should set initial value of period', async () => {
    await setup();

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });
    const endDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /end-date-input/i,
    });

    expect(startDateInput.value).not.toBe('');
    expect(endDateInput.value).not.toBe('');
  });

  it('should show search button', async () => {
    await setup();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('should search batches on init', async () => {
    await setup();
    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
  });

  it('should show loading indicator when starting a new search of batches', async () => {
    await setup();
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    userEvent.click(screen.getByText('Search'));
    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
  });
});
