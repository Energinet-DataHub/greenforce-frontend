import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WattResizeObserverService } from './watt-resize-observer.service';

@Directive({ standalone: true, selector: '[wattResizeObserver]' })
export class WattResizeObserverDirective implements OnDestroy {
  // The `resize` event only natively exists on `window`.
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() resize: EventEmitter<ResizeObserverEntry> = new EventEmitter();

  private subscription: Subscription;

  constructor(
    private el: ElementRef,
    private resizeObserverService: WattResizeObserverService
  ) {
    this.subscription = this.resizeObserverService
      .observe(this.el.nativeElement)
      .subscribe((entry) => this.resize.emit(entry));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
