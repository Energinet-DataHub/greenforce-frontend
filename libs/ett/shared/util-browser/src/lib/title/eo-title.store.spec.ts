import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';

import { EoTitleStore } from './eo-title.store';

@Component({
  template: '',
})
class TestNestedComponent {}

describe(EoTitleStore.name, () => {
  beforeEach(() => {
    // Arrange
    TestBed.configureTestingModule({
      declarations: [TestNestedComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'metering-points',
            data: { title: 'Metering points' },
            children: [
              {
                path: ':id',
                data: { title: 'Metering point detail for: 123456789012345' },
                component: TestNestedComponent,
              },
            ],
          },
        ]),
      ],
    });

    router = TestBed.inject(Router);
    store = TestBed.inject(EoTitleStore);
  });

  let router: Router;
  let store: EoTitleStore;

  describe('routeTitle$', () => {
    it('the route title of the most nested activated route is emitted', async () => {
      // Arrange
      const whenRouteTitle = firstValueFrom(store.routeTitle$);

      // Act
      router.navigateByUrl('metering-points/123456789012345');

      // Assert
      expect(await whenRouteTitle).toBe(
        'Metering point detail for: 123456789012345'
      );
    });
  });

  it('the document title is updated when a route with a title is activated', async () => {
    // Arrange
    const documentTitle = TestBed.inject(Title);
    const setTitleSpy = jest.spyOn(documentTitle, 'setTitle');

    // Act
    await router.navigateByUrl('metering-points/123456789012345');

    // Assert
    expect(setTitleSpy).toHaveBeenCalledWith(
      'Metering point detail for: 123456789012345 | Energy Origin'
    );
  });
});
