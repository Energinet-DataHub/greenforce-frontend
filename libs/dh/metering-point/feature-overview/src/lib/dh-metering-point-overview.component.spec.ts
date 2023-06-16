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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, importProvidersFrom } from '@angular/core';
import { Location } from '@angular/common';
import { Router, provideRouter } from '@angular/router';
import { screen } from '@testing-library/angular';
import { provideHttpClient } from '@angular/common/http';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/routing';

import { DhMeteringPointOverviewComponent } from './dh-metering-point-overview.component';
import { dhMeteringPointFeatureOverviewRoutes } from './dh-metering-point-feature-overview.routes';

@Component({
  selector: 'dh-test-app',
  template: '<router-outlet><router-outlet>',
})
class TestAppComponent {}

describe(DhMeteringPointOverviewComponent, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestAppComponent],
      imports: [getTranslocoTestingModule()],
      providers: [
        provideRouter([
          {
            path: dhMeteringPointPath,
            children: dhMeteringPointFeatureOverviewRoutes,
          },
        ]),
        provideHttpClient(),
        importProvidersFrom(DhApiModule.forRoot()),
      ],
    });

    rootFixture = TestBed.createComponent(TestAppComponent);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  let location: Location;
  let rootFixture: ComponentFixture<TestAppComponent>;
  let router: Router;
  const meteringPointId = '571313180400014602';

  it('displays a link to the Metering point URL', async () => {
    await rootFixture.ngZone?.run(() => router.navigate([dhMeteringPointPath, meteringPointId]));

    await rootFixture.whenStable();

    const [topLevelLink]: HTMLAnchorElement[] = await screen.findAllByRole('link');
    userEvent.click(topLevelLink);

    await rootFixture.whenStable();

    expect(location.path()).toBe(`/metering-point`);
  });

  describe('When a metering point exists', () => {
    it('Then the metering point id is displayed in a heading', async () => {
      await rootFixture.ngZone?.run(() => router.navigate([dhMeteringPointPath, meteringPointId]));
      await waitFor(() => {
        const heading = screen.getByRole('heading', {
          level: 1,
        });
        expect(heading).toHaveTextContent(meteringPointId);
      });
    });
  });

  describe('When a metering point is not found', () => {
    const nullMeteringPointId = '000000000000000000';

    it('Then an error message is displayed in a heading', async () => {
      await rootFixture.ngZone?.run(() =>
        router.navigate([dhMeteringPointPath, nullMeteringPointId])
      );

      await rootFixture.whenStable();

      expect(
        await screen.findByRole('heading', {
          level: 3,
        })
      ).toBeInTheDocument();
    });
  });
});
