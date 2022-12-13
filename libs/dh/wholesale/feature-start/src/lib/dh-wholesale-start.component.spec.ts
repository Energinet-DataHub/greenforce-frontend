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
import { render, screen } from '@testing-library/angular';
import { HttpClientModule } from '@angular/common/http';

import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';

import { DhWholesaleStartComponent } from './dh-wholesale-start.component';

describe(DhWholesaleStartComponent.name, () => {
  async function setup() {
    const { fixture } = await render(DhWholesaleStartComponent, {
      imports: [
        WattDanishDatetimeModule.forRoot(),
        getTranslocoTestingModule(),
        DhApiModule.forRoot(),
        HttpClientModule,
      ],
    });

    const submitButton = screen.getByRole('button', {
      name: enTranslations.wholesale.startBatch.startLabel,
    });

    return {
      submitButton,
      fixture,
    };
  }

  it('start button should be disabled until dateRange and gridAreaDropbox both have data', async () => {
    const { submitButton, fixture } = await setup();
    expect(submitButton).toBeDisabled();

    fixture.componentInstance.formControlGridArea.setValue(['806', '805']);
    fixture.componentInstance.formControlRange.setValue({
      start: '2022-08-31T22:00:00.000Z',
      end: '2022-09-09T22:00:00.000Z',
    });

    fixture.detectChanges();
    expect(submitButton).toBeEnabled();
  });
});
