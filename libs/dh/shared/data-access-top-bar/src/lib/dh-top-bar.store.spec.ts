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
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom, skip } from 'rxjs';

import { DhTopBarStore } from './dh-top-bar.store';
import { titleTranslationKey } from './title-translation-key';

@Component({
  template: '',
})
class TestNestedComponent {}

const testMeteringPointsPath = 'test-metering-points-path';

const fakeParentTitleTranslationKey = 'fake.parent.title.translation.key';
const fakeChildTitleTranslationKey = 'fake.child.title.translation.key';

describe(DhTopBarStore.name, () => {
  function setup(routes: Routes) {
    TestBed.configureTestingModule({
      declarations: [TestNestedComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    const router = TestBed.inject(Router);
    const store = TestBed.inject(DhTopBarStore);

    return {
      router,
      store,
    };
  }

  describe('titleTranslationKey$', () => {
    it('empty string is emitted if no title translation key is set up', async () => {
      // Arrange
      const testRoutes: Routes = [
        {
          path: testMeteringPointsPath,
          component: TestNestedComponent,
        },
      ];

      const { router, store } = setup(testRoutes);

      const actualTitleTranslationKey = firstValueFrom(store.titleTranslationKey$);

      // Act
      router.navigateByUrl(testMeteringPointsPath);

      // Assert
      expect(await actualTitleTranslationKey).toBe('');
    });

    it('the title translation key of the most nested activated route is emitted', async () => {
      // Arrange
      const testRoutes: Routes = [
        {
          path: testMeteringPointsPath,
          data: { [titleTranslationKey]: fakeParentTitleTranslationKey },
          children: [
            {
              path: ':id',
              data: { [titleTranslationKey]: fakeChildTitleTranslationKey },
              component: TestNestedComponent,
            },
          ],
        },
      ];

      const { router, store } = setup(testRoutes);

      const actualTitleTranslationKey = firstValueFrom(store.titleTranslationKey$.pipe(skip(1)));

      // Act
      router.navigateByUrl(`${testMeteringPointsPath}/123456789012345`);

      // Assert
      expect(await actualTitleTranslationKey).toBe(fakeChildTitleTranslationKey);
    });

    it('the title translation key of the parent route is emitted when nested route does not have title translation key set up', async () => {
      // Arrange
      const testRoutes: Routes = [
        {
          path: testMeteringPointsPath,
          data: { [titleTranslationKey]: fakeParentTitleTranslationKey },
          children: [
            {
              path: ':id',
              component: TestNestedComponent,
            },
          ],
        },
      ];

      const { router, store } = setup(testRoutes);

      const actualTitleTranslationKey = firstValueFrom(store.titleTranslationKey$.pipe(skip(1)));

      // Act
      router.navigateByUrl(`${testMeteringPointsPath}/123456789012345`);

      // Assert
      expect(await actualTitleTranslationKey).toBe(fakeParentTitleTranslationKey);
    });
  });
});
