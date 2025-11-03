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
import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { createPopper, Instance } from '@popperjs/core';
import { Platform } from '@angular/cdk/platform';

import { wattTooltipPosition, wattTooltipVariant } from './watt-tooltip.directive';
import { FocusMonitor } from '@angular/cdk/a11y';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type unlistenerFunction = () => void;

@Component({
  template: `
    {{ text() }}
    <div #arrow class="arrow"></div>
  `,
  selector: 'watt-tooltip',
  styleUrls: ['./watt-tooltip.component.scss'],
  host: {
    '[id]': 'id',
    '[attr.role]': '"tooltip"',
    '[class]': 'hostClass()',
  },
})
export class WattTooltipComponent {
  static nextId = 0;

  text = input.required<string>();
  target = input.required<HTMLElement>();
  position = input.required<wattTooltipPosition>();
  variant = input.required<wattTooltipVariant>();

  readonly id = `watt-tooltip-${WattTooltipComponent.nextId++}`; // used by aria-describedby
  hostClass = computed(() => `tooltip-${this.variant()}`);

  private element: HTMLElement = inject(ElementRef).nativeElement;
  private platform = inject(Platform);
  private renderer: Renderer2 = inject(Renderer2);
  private focusMonitor: FocusMonitor = inject(FocusMonitor);
  private destroyRef = inject(DestroyRef);

  private listeners: unlistenerFunction[] = [];
  private showClass = 'show';
  private popper: Instance | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.popper?.destroy();
      this.listeners.forEach((listener) => listener());
    });

    effect(() => {
      this.setupEventListeners();

      this.focusMonitor
        .monitor(this.target(), true)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((origin) => {
          if (!origin) {
            this.hide();
          } else if (origin === 'keyboard') {
            this.show();
          }
        });
    });
  }

  private setupEventListeners(): void {
    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (this.platformSupportsMouseEvents()) {
      const mouseEnter = this.renderer.listen(this.target(), 'mouseenter', this.show.bind(this));
      const mouseLeave = this.renderer.listen(this.target(), 'mouseleave', this.hide.bind(this));
      const wheel = this.renderer.listen(this.target(), 'wheel', this.hide.bind(this));
      this.listeners.push(mouseEnter, mouseLeave, wheel);
    } else {
      const touchStart = this.renderer.listen(this.target(), 'touchstart', this.show.bind(this));
      const touchEnd = this.renderer.listen(this.target(), 'touchend', this.hide.bind(this));
      const touchCancel = this.renderer.listen(this.target(), 'touchcancel', this.hide.bind(this));
      this.listeners.push(touchStart, touchEnd, touchCancel);
    }
  }

  private show(): void {
    if (!this.popper) {
      this.popper = createPopper(this.target(), this.element, {
        placement: this.position(),
      });
    } else {
      this.popper.forceUpdate();
    }
    this.renderer.addClass(this.element, this.showClass);
  }

  private hide(): void {
    this.renderer.removeClass(this.element, this.showClass);
  }

  private platformSupportsMouseEvents() {
    return !this.platform.IOS && !this.platform.ANDROID;
  }
}
