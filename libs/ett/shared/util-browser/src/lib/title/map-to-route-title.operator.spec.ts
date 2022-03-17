import { ActivatedRouteSnapshot, ActivationEnd, Event } from '@angular/router';
import { from, lastValueFrom, Observable } from 'rxjs';

import { mapToRouteTitle } from './map-to-route-title.operator';

describe('mapToRouteTitle', () => {
  it('the route title of the last ActivationEnd event is emitted', async () => {
    // Arrange
    const parentActivatedRoute: Partial<ActivatedRouteSnapshot> = {
      data: {
        title: 'Metering points',
      },
    };
    const childActivatedRoute: Partial<ActivatedRouteSnapshot> = {
      data: {
        title: 'Metering point detail for: 123456789012345',
      },
    };
    const source$: Observable<Event> = from([
      new ActivationEnd(parentActivatedRoute as ActivatedRouteSnapshot),
      new ActivationEnd(childActivatedRoute as ActivatedRouteSnapshot),
    ]);

    // Act
    const title = await lastValueFrom(source$.pipe(mapToRouteTitle));

    // Assert
    expect(title).toBe('Metering point detail for: 123456789012345');
  });
});
