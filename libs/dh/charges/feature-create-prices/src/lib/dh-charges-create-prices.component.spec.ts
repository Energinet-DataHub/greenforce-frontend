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
import { render } from '@testing-library/angular';
import {
  DhChargesCreatePricesComponent,
  DhChargesCreatePricesScam,
} from './dh-charges-create-prices.component';

describe('DhChargesCreatePrices', () => {
  async function setup() {
    const { fixture } = await render(DhChargesCreatePricesComponent, {
      imports: [
        getTranslocoTestingModule(),
        MatNativeDateModule,
        DhApiModule.forRoot(),
        HttpClientModule,
        DhChargesCreatePricesScam,
      ],
    });

    return {
      fixture,
    };
  }

  it('should fetch and render data on submit', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
