/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { TestBed } from '@angular/core/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { Location } from '@angular/common';

import {
  DhMeteringPointSearchComponent,
  DhMeteringPointSearchScam,
} from './dh-metering-point-search.component';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { Component } from '@angular/core';

@Component({
  template: `nothing to see here`,
})
class NoopComponent {}

describe(DhMeteringPointSearchComponent.name, () => {
  async function setup() {
    const { fixture } = await render(DhMeteringPointSearchComponent, {
      imports: [
        getTranslocoTestingModule(),
        DhApiModule.forRoot(),
        HttpClientModule,
        DhMeteringPointSearchScam,
      ],
      routes: [{ path: ':metering-point-id', component: NoopComponent }],
    });

    const activatedRoute = TestBed.inject(ActivatedRoute);

    const input: HTMLInputElement = screen.getByRole('textbox', {
      name: /search-input/i,
    });

    const submitButton = screen.getByRole('button', {
      name: enTranslations.meteringPoint.search.searchButton,
    });

    return {
      input,
      submitButton,
      activatedRoute,
      fixture,
    };
  }

  it('should show heading of level 1', async () => {
    await setup();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should redirect to overview, if metering point is found', async () => {
    const { input, submitButton } = await setup();
    const location: Location = TestBed.inject(Location);

    userEvent.type(input, '575391908025497398');
    userEvent.click(submitButton);

    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'), {
      timeout: 3000,
    });
    expect(
      screen.queryByRole('heading', {
        name: /sorry, we did not find a metering point match/i,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /oops! there was an error/i })
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(location.path()).toBe('/575391908025497398');
    });
  });

  it('should show empty state if no metering point is found', async () => {
    const { input, submitButton } = await setup();
    const location: Location = TestBed.inject(Location);

    userEvent.type(input, '000000000000000000');
    userEvent.click(submitButton);

    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'), {
      timeout: 3000,
    });
    expect(
      screen.queryByRole('heading', {
        name: /sorry, we did not find a metering point match/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /oops! there was an error/i })
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(location.path()).toBe('/?q=000000000000000000');
    });
  });
});
