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
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  dhMeteringPointIdParam,
  DhMeteringPointOverviewGuard,
  dhMeteringPointPath,
} from '@energinet-datahub/dh/metering-point/routing';
import { render, RenderResult, screen } from '@testing-library/angular';
import { SpectacularAppComponent } from '@ngworker/spectacular';

import {
  DhMeteringPointOverviewComponent,
  DhMeteringPointOverviewScam,
} from './dh-metering-point-overview.component';

describe(DhMeteringPointOverviewComponent.name, () => {
  @Component({
    template: '',
  })
  class TestMeteringPointSearchComponent {}

  beforeEach(async () => {
    view = await render(SpectacularAppComponent, {
      declarations: [TestMeteringPointSearchComponent],
      imports: [DhMeteringPointOverviewScam],
      routes: [
        {
          path: dhMeteringPointPath,
          children: [
            {
              component: TestMeteringPointSearchComponent,
              path: 'search',
            },
            {
              canActivate: [DhMeteringPointOverviewGuard],
              component: DhMeteringPointOverviewComponent,
              path: `:${dhMeteringPointIdParam}`,
            },
          ],
        },
      ],
    });

    angularLocation = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  let angularLocation: Location;
  let router: Router;
  let view: RenderResult<SpectacularAppComponent>;
  let link: HTMLAnchorElement;

  it('displays the Watt shell', async () => {
    const meteringPointUrl = `http://localhost/${dhMeteringPointPath}`;

    await view.navigate(`/${dhMeteringPointPath}/571313180400014077`);

    link = await screen.findByRole('link');

    const actualUrl = new URL(link.href);

    expect(actualUrl.origin + actualUrl.pathname).toBe(meteringPointUrl);
  });
});
