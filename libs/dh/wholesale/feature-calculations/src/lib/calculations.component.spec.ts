//#region License
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
//#endregion
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { render, screen } from '@testing-library/angular';

import { graphQLProvider } from '@energinet-datahub/dh/shared/data-access-graphql';
import { getTranslocoTestingModule, MsalServiceMock } from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';

import { DhCalculationsComponent } from './calculations.component';

async function setup() {
  await render(DhCalculationsComponent, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      graphQLProvider,
      danishDatetimeProviders,
      MsalServiceMock,
    ],
    imports: [getTranslocoTestingModule()],
  });
}

describe(DhCalculationsComponent, () => {
  it('should show filter chips', async () => {
    await setup();
    ['Calculation type', 'Calculation period', 'Execution type', 'Grid areas', 'Status']
      .map((filter) => new RegExp(filter))
      .flatMap((name) => [
        { name, pressed: true },
        { name, pressed: false },
      ])
      .map((options) => screen.queryByRole('button', options))
      .filter((element) => element != null)
      .forEach((element) => expect(element).toBeInTheDocument());
  });

  it('should show clear button', async () => {
    await setup();
    expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
  });

  it('should show search button', async () => {
    await setup();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
