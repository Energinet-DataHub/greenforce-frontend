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
import { HarnessLoader } from '@angular/cdk/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectHarness } from '@angular/material/select/testing';
import { render, screen } from '@testing-library/angular';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import userEvent from '@testing-library/user-event';

import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { WattToastModule } from '@energinet-datahub/watt/toast';

import { DhWholesaleStartComponent } from './dh-wholesale-start.component';

describe(DhWholesaleStartComponent.name, () => {
  async function setup() {
    const { fixture } = await render(DhWholesaleStartComponent, {
      imports: [
        DhApiModule.forRoot(),
        getTranslocoTestingModule(),
        HttpClientModule,
        WattDanishDatetimeModule.forRoot(),
        WattToastModule.forRoot(),
      ],
    });

    const harnessLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return {
      harnessLoader,
    };
  }

  function setPeriod(startDate: string, endDate: string) {
    const periodStart: HTMLInputElement = screen.getByRole('textbox', {
      name: 'start-date-input',
    });
    const periodEnd: HTMLInputElement = screen.getByRole('textbox', {
      name: 'end-date-input',
    });

    periodStart.setSelectionRange(0, 0);
    periodEnd.setSelectionRange(0, 0);

    userEvent.type(periodStart, startDate);
    userEvent.type(periodEnd, endDate);
  }

  async function selectGridArea(
    harnessLoader: HarnessLoader,
    gridArea: string
  ) {
    const selectHarness = await harnessLoader.getHarness(MatSelectHarness);
    await selectHarness.open();
    await selectHarness.clickOptions({ text: gridArea });
  }

  it('start button should be disabled until dateRange and gridAreaDropbox both have data', async () => {
    // Arrange
    const { harnessLoader } = await setup();
    const submit = screen.getByRole('button', {
      name: enTranslations.wholesale.startBatch.startLabel,
    });
    expect(submit).toBeDisabled();

    // Act
    await selectGridArea(harnessLoader, '806');
    setPeriod('09032022', '09032022');

    // Assert
    expect(submit).toBeEnabled();
  });
});
