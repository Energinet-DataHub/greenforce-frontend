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
import { Injectable, NgZone } from '@angular/core';
import { filter, finalize, Subject } from 'rxjs';

/**
 * Service for observing changes to an elements size. Typically used by
 * the `WattResizeObserverDirective`, but can also be imported directly.
 *
 * Usage:
 * `import { WattResizeObserverService } from '@energinet-datahub/watt/resize-observer';`
 */
@Injectable({ providedIn: 'root' })
export class WattResizeObserverService {
  private resizeObserver?: ResizeObserver;
  private entrySubject = new Subject<ResizeObserverEntry>();

  constructor(private ngZone: NgZone) {
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        // Resize callback is running outside of Angular zone
        this.ngZone.run(() => {
          for (const entry of entries) {
            this.entrySubject.next(entry);
          }
        });
      });
    }
  }

  /**
   * Add an element to be observed, returning an observable that
   * emits whenever that element changes size. Element will
   * automatically be unobserved when the observable is unsubscribed.
   */
  observe(element: Element) {
    this.resizeObserver?.observe(element);
    return this.entrySubject.asObservable().pipe(
      filter((entry) => entry.target === element),
      finalize(() => this.resizeObserver?.unobserve(element))
    );
  }
}
