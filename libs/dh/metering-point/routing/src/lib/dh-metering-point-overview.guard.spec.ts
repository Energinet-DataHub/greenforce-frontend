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
import { SpectacularAppComponent } from '@ngworker/spectacular';
import { render, RenderResult } from '@testing-library/angular';
import {
  validGsrnNumber,
  invalidGsrnNumber,
} from '@energinet-datahub/dh/shared/test-util-metering-point';

import { DhMeteringPointOverviewGuard } from './dh-metering-point-overview.guard';
import { dhGsrnNumberParam } from './dh-gsrn-number-param';
import { dhMeteringPointPath } from './dh-metering-point-path';

describe(DhMeteringPointOverviewGuard.name, () => {
  @Component({
    template: '',
  })
  class TestGuardedComponent {}

  @Component({
    template: '',
  })
  class TestMeteringPointSearchComponent {}

  beforeEach(async () => {
    view = await render(SpectacularAppComponent, {
      declarations: [TestGuardedComponent, TestMeteringPointSearchComponent],
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
              component: TestGuardedComponent,
              path: `:${dhGsrnNumberParam}`,
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

  describe('When GSRN number is valid', () => {
    it('Then navigation is allowed', async () => {
      const guardedPath = `${dhMeteringPointPath}/${validGsrnNumber}`;

      const expectedUrl = router.serializeUrl(
        router.createUrlTree([guardedPath])
      );

      await view.navigate('/', guardedPath);

      expect(decodeURIComponent(angularLocation.path())).toBe(
        decodeURIComponent(expectedUrl)
      );
    });
  });

  describe('When GSRN number is NOT valid', () => {
    it('Then the user is redirected to the search page', async () => {
      const guardedPath = `${dhMeteringPointPath}/${invalidGsrnNumber}`;

      const expectedUrl = router.serializeUrl(
        router.createUrlTree([dhMeteringPointPath, 'search'])
      );

      await view.navigate('/', guardedPath);

      expect(decodeURIComponent(angularLocation.path())).toBe(
        decodeURIComponent(expectedUrl)
      );
    });
  });
});
