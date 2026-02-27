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
  readonly alwaysVisible = input(false, { alias: 'wattTooltipAlwaysVisible', transform: booleanAttribute });

  private readonly element = inject(ElementRef).nativeElement;
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    let tooltipComponent: ReturnType<typeof this.viewContainerRef.createComponent<WattTooltipComponent>> | null = null;

    // Setup effect to manage tooltip component lifecycle
    effect(() => {
      const text = this.text();

      // Destroy previous instance when inputs change
      if (tooltipComponent) {
        tooltipComponent.destroy();
        tooltipComponent = null;
        this.element.removeAttribute('aria-describedby');
      }

      if (!text) return;

      // Create the component
      tooltipComponent = this.viewContainerRef.createComponent(WattTooltipComponent);

      // Get the component instance
      const instance = tooltipComponent.instance;

      // Set up bindings
      tooltipComponent.setInput('text', text);
      tooltipComponent.setInput('target', this.element);
      tooltipComponent.setInput('position', this.position());
      tooltipComponent.setInput('variant', this.variant());
      tooltipComponent.setInput('alwaysVisible', this.alwaysVisible());

      this.element.setAttribute('aria-describedby', instance.id);

      if (this.alwaysVisible()) {
        requestAnimationFrame(() => requestAnimationFrame(() => instance.show()));
      }
    });

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      tooltipComponent?.destroy();
      this.element.removeAttribute('aria-describedby');
    });
  }
}
