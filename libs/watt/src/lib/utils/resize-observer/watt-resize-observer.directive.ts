import { Directive, ElementRef, EventEmitter, OnDestroy, Output, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { WattResizeObserverService } from './watt-resize-observer.service';

/**
 * Standalone directive for subscribing to changes to the size of an element.
 * The `resize` event emits initially and then everytime the element is resized.
 *
 * Usage:
 * `import { WattResizeObserverDirective } from '@energinet-datahub/watt/resize-observer';`
 */
@Directive({ standalone: true, selector: '[wattResizeObserver]' })
export class WattResizeObserverDirective implements OnDestroy {
  private el = inject(ElementRef);
  private resizeObserverService = inject(WattResizeObserverService);
  // The `resize` event only natively exists on `window`.
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() resize: EventEmitter<ResizeObserverEntry> = new EventEmitter();

  private subscription: Subscription;

  constructor() {
    this.subscription = this.resizeObserverService
      .observe(this.el.nativeElement)
      .subscribe((entry) => this.resize.emit(entry));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
