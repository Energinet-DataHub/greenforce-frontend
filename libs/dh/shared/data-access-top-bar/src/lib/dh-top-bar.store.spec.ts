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

describe(DhTopBarStore, () => {
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
