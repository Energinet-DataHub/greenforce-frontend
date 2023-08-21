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
import { Injectable } from '@angular/core';
import { filter, finalize, Subject } from 'rxjs';

/**
 * Service for observing changes in the intersection of a target element with
 * the viewport.
 *
 * Usage:
 * `import { WattIntersectionObserverService } from '@energinet-datahub/watt/intersection-observer';`
 */
@Injectable({ providedIn: 'root' })
export class WattIntersectionObserverService {
  private intersectionObserver?: IntersectionObserver;
  private entrySubject = new Subject<IntersectionObserverEntry>();

  constructor() {
    if (window.IntersectionObserver) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          this.entrySubject.next(entry);
        }
      });
    }
  }

  /**
   * Add an element to be observed, returning an observable that emits
   * whenever that element enters or leaves the viewport. Element will
   * automatically be unobserved when the observable is unsubscribed.
   */
  observe(element: Element) {
    this.intersectionObserver?.observe(element);
    return this.entrySubject.asObservable().pipe(
      filter((entry) => entry.target === element),
      finalize(() => this.intersectionObserver?.unobserve(element))
    );
  }
}
