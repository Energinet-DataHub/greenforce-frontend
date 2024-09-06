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
import { APP_INITIALIZER } from '@angular/core';
import { MockProvider } from 'ng-mocks';

import { dhNewVersionManagerInitializer } from './dh-new-version-manager.initializer';
import { DhNewVersionManager } from './dh-new-version-manager.service';

describe('dhNewVersionManagerInitializer', () => {
  it('is not initialized when the initializer is not imported', () => {
    const appInitializerToken = TestBed.inject(APP_INITIALIZER, null);

    expect(appInitializerToken).toBeNull();
  });

  it(`initializes during APP_INITIALIZER`, () => {
    // Arrange
    TestBed.configureTestingModule({
      providers: [
        dhNewVersionManagerInitializer,
        MockProvider(DhNewVersionManager, {
          init: jest.fn(),
        }),
      ],
    });

    // Act
    const newVersionManager = TestBed.inject(DhNewVersionManager);

    // Assert
    expect(newVersionManager.init).toHaveBeenCalled();
  });
});
