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
import { FeatureFlagService } from './feature-flag.service';

describe(FeatureFlagService.name, () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    service = TestBed.inject(FeatureFlagService);
  });

  /**
   * At the time of writing this test, the jest setup was not working correctly.
   * Instead of spending massive amount of time investigating, we opted to use
   * a test of the "getEnabledFlags" function instead of mocking localStorage.
   * TODO: Fix this test when jest spyon mocking works once more
   */
  describe('If flag name is valid', () => {
    it('it can save it', () => {
      const winterFlag = new Set().add('test');

      service.enableFeatureFlag('test');
      expect(service.getEnabledFlags()).toEqual(winterFlag);
    });

    it('it can remove it', () => {
      const winterFlag = new Set().add('test');
      const noFlag = new Set();

      service.enableFeatureFlag('test');
      expect(service.getEnabledFlags()).toEqual(winterFlag);

      service.disableFeatureFlag('test');
      expect(service.getEnabledFlags()).toEqual(noFlag);
    });
  });

  describe('If flag name is NOT valid', () => {
    it('it can NOT save it', () => {
      const noFlag = new Set();

      service.enableFeatureFlag('summer');
      expect(service.getEnabledFlags()).toEqual(noFlag);
    });
  });
});
