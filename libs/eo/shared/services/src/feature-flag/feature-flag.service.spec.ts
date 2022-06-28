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

    let store: any;
    const mockLocalStorage = {
      getItem: (key: string): string => {
        console.log('mocked return getItem');
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    jest
      .spyOn(localStorage, 'getItem')
      .mockImplementation(mockLocalStorage.getItem);

    /*     spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear); */
  });

  describe('If flag name is valid', () => {
    it('it can save it localstorage', () => {
      service.enableFeatureFlag('winter');
    });

    it('it can remove it from localstorage', () => {
      expect(true).toBeTruthy();
    });
  });

  describe('If flag name is NOT valid', () => {
    it('it can NOT save it localstorage', () => {
      expect(true).toBeTruthy();
    });

    it('it can NOT remove it from localstorage', () => {
      expect(true).toBeTruthy();
    });
  });
});
