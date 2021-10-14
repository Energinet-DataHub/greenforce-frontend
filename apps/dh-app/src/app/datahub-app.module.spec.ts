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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DataHubAppComponent } from './datahub-app.component';
import { DataHubAppModule } from './datahub-app.module';

describe('Application smoke test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataHubAppModule, NoopAnimationsModule, RouterTestingModule],
      // https://github.com/thymikee/jest-preset-angular/issues/83
      providers: [{provide: MATERIAL_SANITY_CHECKS, useValue: false}]
    }).compileComponents();

    rootFixture = TestBed.createComponent(DataHubAppComponent);
    router = TestBed.inject(Router);

    rootFixture.autoDetectChanges(true);
  });

  let rootFixture: ComponentFixture<DataHubAppComponent>;
  let router: Router;

  it('navigation works', async () => {
    expect.assertions(1);

    const whenNavigatedToDefaultRoute = rootFixture.ngZone?.run(() =>
      router.navigateByUrl('/')
    );

    await expect(whenNavigatedToDefaultRoute).resolves.toBe(true);
  });
});
