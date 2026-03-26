//#region License
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
//#endregion
import { Directive, ElementRef, OnDestroy, inject, output } from '@angular/core';
import { Subscription } from 'rxjs';

import { WattResizeObserverService } from './watt-resize-observer.service';

/**
 * A directive for subscribing to changes to the size of an element.
 * The `resize` event emits initially and then everytime the element is resized.
 *
 * Usage:
 * `import { WattResizeObserverDirective } from '@energinet/watt/resize-observer';`
 */
@Directive({ selector: '[wattResizeObserver]' })
export class WattResizeObserverDirective implements OnDestroy {
  private elementRef = inject(ElementRef);
  private resizeObserverService = inject(WattResizeObserverService);

  // The `resize` event only natively exists on `window`.
  // eslint-disable-next-line @angular-eslint/no-output-native
  resize = output<ResizeObserverEntry>();

  private subscription: Subscription;

  constructor() {
    this.subscription = this.resizeObserverService
      .observe(this.elementRef.nativeElement)
      .subscribe((entry) => this.resize.emit(entry));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
