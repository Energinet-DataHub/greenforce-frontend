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
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ViewContainerRef,
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

  private readonly element = inject(ElementRef).nativeElement;
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private tooltip = computed(() => this.createTooltipComponent());

  constructor() {
    // Setup effect to manage tooltip component lifecycle
    effect(() => {
      // Access the tooltip computed to create/update it when inputs change
      const tooltipComponent = this.tooltip();

      // Cleanup on destroy
      this.destroyRef.onDestroy(() => {
        tooltipComponent?.destroy();
        this.element.removeAttribute('aria-describedby');
      });
    });
  }

  private createTooltipComponent() {
    if (!this.text()) return null;

    // Create the component
    const tooltipComponent = this.viewContainerRef.createComponent(WattTooltipComponent);

    // Get the component instance
    const instance = tooltipComponent.instance;

    // Set up bindings
    tooltipComponent.setInput('text', this.text());
    tooltipComponent.setInput('target', this.element);
    tooltipComponent.setInput('position', this.position());
    tooltipComponent.setInput('variant', this.variant());

    this.element.setAttribute('aria-describedby', instance.id);

    return tooltipComponent;
  }
}
