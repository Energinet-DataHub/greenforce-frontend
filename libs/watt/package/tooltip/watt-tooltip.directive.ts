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
  ComponentRef,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ViewContainerRef,
  booleanAttribute,
} from '@angular/core';

import { WattTooltipComponent } from './watt-tooltip.component';

export type wattTooltipPosition =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left';

export type wattTooltipVariant = 'dark' | 'light';

@Directive({
  selector: '[wattTooltip]',
  exportAs: 'wattTooltip',
})
export class WattTooltipDirective {
  readonly text = input<string>('', { alias: 'wattTooltip' });
  readonly position = input<wattTooltipPosition>('top', { alias: 'wattTooltipPosition' });
  readonly variant = input<wattTooltipVariant>('dark', { alias: 'wattTooltipVariant' });
  readonly alwaysVisible = input(false, {
    alias: 'wattTooltipAlwaysVisible',
    transform: booleanAttribute,
  });

  private readonly element = inject(ElementRef).nativeElement;
  private readonly viewContainerRef = inject(ViewContainerRef);
  private tooltipRef: ComponentRef<WattTooltipComponent> | null = null;

  constructor() {
    // Create or destroy the tooltip component when text changes
    effect(() => {
      const text = this.text();

      if (!text) {
        this.destroyTooltip();
        return;
      }

      if (!this.tooltipRef) {
        this.tooltipRef = this.viewContainerRef.createComponent(WattTooltipComponent);
        this.tooltipRef.setInput('target', this.element);
        this.element.setAttribute('aria-describedby', this.tooltipRef.instance.id);
      }

      this.tooltipRef.setInput('text', text);
    });

    // Update position, variant, and alwaysVisible without recreating the component
    effect(() => {
      if (!this.tooltipRef) return;

      this.tooltipRef.setInput('position', this.position());
      this.tooltipRef.setInput('variant', this.variant());
      this.tooltipRef.setInput('alwaysVisible', this.alwaysVisible());

      if (this.alwaysVisible()) {
        const instance = this.tooltipRef.instance;
        requestAnimationFrame(() => requestAnimationFrame(() => instance.show()));
      }
    });

    inject(DestroyRef).onDestroy(() => this.destroyTooltip());
  }

  private destroyTooltip(): void {
    this.tooltipRef?.destroy();
    this.tooltipRef = null;
    this.element.removeAttribute('aria-describedby');
  }
}
