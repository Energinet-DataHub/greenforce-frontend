//#region License
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
//#endregion
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';

import { DhTopBarService } from './dh-top-bar.service';
import { titleTranslationKey } from './title-translation-key';

@Component({
  template: '',
})
class TestNestedComponent {}

const testMeteringPointsPath = 'test-metering-points-path';

const fakeParentTitleTranslationKey = 'fake.parent.title.translation.key';
const fakeChildTitleTranslationKey = 'fake.child.title.translation.key';

describe(DhTopBarService, () => {
  function setup(routes: Routes) {
    TestBed.configureTestingModule({
      imports: [TestNestedComponent],
      providers: [provideRouter(routes)],
    });

    const router = TestBed.inject(Router);
    const store = TestBed.inject(DhTopBarService);

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

      // Act
      await router.navigateByUrl(testMeteringPointsPath);

      // Need to wait for navigation to complete and the store to update
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(store.titleTranslationKey()).toBe('');
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

      // Act
      await router.navigateByUrl(`${testMeteringPointsPath}/123456789012345`);

      // Need to wait for navigation to complete and the store to update
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(store.titleTranslationKey()).toBe(fakeChildTitleTranslationKey);
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

      // Act
      await router.navigateByUrl(`${testMeteringPointsPath}/123456789012345`);

      // Need to wait for navigation to complete and the store to update
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(store.titleTranslationKey()).toBe(fakeParentTitleTranslationKey);
    });
  });
});
