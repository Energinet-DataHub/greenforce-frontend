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
import { Directive, ElementRef, inject, Input, OnInit, ViewContainerRef } from '@angular/core';

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

@Directive({
  selector: '[wattTooltip]',
  standalone: true,
  exportAs: 'wattTooltip',
})
export class WattTooltipDirective implements OnInit {
  @Input('wattTooltip') text!: string;
  @Input('wattTooltipPosition') position: wattTooltipPosition = 'top';

  private element: HTMLElement = inject(ElementRef).nativeElement;
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.createTooltipComponent();
  }

  private createTooltipComponent() {
    const tooltip =
      this.viewContainerRef.createComponent<WattTooltipComponent>(WattTooltipComponent);
    tooltip.instance.text = this.text;
    tooltip.instance.target = this.element;
    tooltip.instance.position = this.position;

    this.element.setAttribute('aria-describedby', tooltip.instance.id);
  }
}
