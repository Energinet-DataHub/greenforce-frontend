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
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { createPopper, Instance } from '@popperjs/core';

import { wattTooltipPosition, wattTooltipVariant } from './watt-tooltip.directive';

@Component({
  selector: 'watt-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './watt-tooltip.component.scss',
  host: {
    '[id]': 'id',
    role: 'tooltip',
    '[class]': 'hostClass()',
    '[class.show]': 'visible()',
  },
  template: `{{ text() }}<div #arrowEl class="arrow"></div>`,
})
export class WattTooltipComponent {
  text = input.required<string>();
  target = input.required<HTMLElement>();
  position = input.required<wattTooltipPosition>();
  variant = input.required<wattTooltipVariant>();
  alwaysVisible = input(false);

  readonly id = `watt-tooltip-${crypto.randomUUID()}`;
  protected readonly visible = signal(false);
  protected readonly hostClass = computed(() => `tooltip-${this.variant()}`);

  private readonly arrowRef = viewChild<ElementRef>('arrowEl');
  private readonly element: HTMLElement = inject(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  private popper: Instance | null = null;

  constructor() {
    afterNextRender(() => this.setupEventListeners());

    this.destroyRef.onDestroy(() => this.popper?.destroy());
  }

  show(): void {
    if (!this.popper) {
      const arrowEl = this.arrowRef()?.nativeElement;
      this.popper = createPopper(this.target(), this.element, {
        placement: this.position(),
        modifiers: [
          { name: 'offset', options: { offset: [0, 8] } },
          ...(arrowEl ? [{ name: 'arrow', options: { element: arrowEl, padding: 6 } }] : []),
        ],
      });
    } else {
      this.popper.forceUpdate();
    }
    this.visible.set(true);
  }

  private hide(): void {
    if (this.alwaysVisible()) return;
    this.visible.set(false);
  }

  private setupEventListeners(): void {
    const target = this.target();

    const onShow = () => this.show();
    const onHide = () => this.hide();

    target.addEventListener('mouseenter', onShow);
    target.addEventListener('mouseleave', onHide);
    target.addEventListener('wheel', onHide, { passive: true });
    target.addEventListener('focusin', onShow);
    target.addEventListener('focusout', onHide);
  }
}
