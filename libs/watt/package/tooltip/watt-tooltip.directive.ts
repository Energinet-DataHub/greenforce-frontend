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
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
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
export class WattTooltipDirective implements OnChanges {
  @Input('wattTooltip') text!: string;
  @Input('wattTooltipPosition') position: wattTooltipPosition = 'top';
  @Input('wattTooltipVariant') variant: wattTooltipVariant = 'dark';

  private element: HTMLElement = inject(ElementRef).nativeElement;
  private viewContainerRef = inject(ViewContainerRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.createTooltipComponent();
    }
  }

  private createTooltipComponent() {
    const tooltip =
      this.viewContainerRef.createComponent<WattTooltipComponent>(WattTooltipComponent);
    tooltip.instance.text = this.text;
    tooltip.instance.target = this.element;
    tooltip.instance.position = this.position;
    tooltip.instance.variant = this.variant;

    this.element.setAttribute('aria-describedby', tooltip.instance.id);
  }
}
