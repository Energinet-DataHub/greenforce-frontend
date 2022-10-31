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
import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
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
