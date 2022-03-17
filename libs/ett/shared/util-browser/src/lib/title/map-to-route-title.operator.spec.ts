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
