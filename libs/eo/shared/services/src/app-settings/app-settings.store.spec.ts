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
import { TestBed } from '@angular/core/testing';
import { AppSettingsStore } from './app-settings.store';

describe(AppSettingsStore.name, () => {
  let store: AppSettingsStore;
  const firstJan2021 = 1609455600000;
  const firstJan2022 = 1640991600000;

  beforeEach(() => {
    store = TestBed.inject(AppSettingsStore);
  });
  describe('calendarDateRange$ selector', () => {
    it('should return 1/1-2021 until 1/1-2022 as default state', (done) => {
      store.calendarDateRange$.subscribe((data) => {
        expect(data).toEqual({ start: firstJan2021, end: firstJan2022 });
        done();
      });
    });

    it('setting a new date should store it', (done) => {
      store.setCalendarDateRange({ start: 1234, end: 2345 });

      store.calendarDateRange$.subscribe((data) => {
        expect(data).toEqual({ start: 1234, end: 2345 });
        done();
      });
    });
  });
});
