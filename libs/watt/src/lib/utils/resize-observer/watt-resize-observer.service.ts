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
          /**
           * Ensure that the function is executed only once per frame, and avoid:
           * "Error: ResizeObserver loop limit exceeded"
           */
          requestAnimationFrame(() => {
            for (const entry of entries) {
              this.entrySubject.next(entry);
            }
          });
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
