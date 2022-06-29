import { Injectable, NgZone } from '@angular/core';
import { filter, finalize, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WattResizeObserverService {
  private resizeObserver: ResizeObserver;
  private entrySubject = new Subject<ResizeObserverEntry>();

  constructor(private ngZone: NgZone) {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.ngZone.run(() => {
        for (const entry of entries) {
          this.entrySubject.next(entry);
        }
      });
    });
  }

  observe(element: Element) {
    this.resizeObserver.observe(element);
    return this.entrySubject.asObservable().pipe(
      filter((entry) => entry.target === element),
      finalize(() => this.resizeObserver.unobserve(element))
    );
  }
}
