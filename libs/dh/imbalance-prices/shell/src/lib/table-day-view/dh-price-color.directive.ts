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
import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

import { WattColorHelperService, WattColor } from '@energinet-datahub/watt/color';

@Directive({
  selector: '[dhPriceColor]',
  standalone: true,
})
export class DhPriceColorDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly wattColorService = inject(WattColorHelperService);

  @Input() set dhPriceColor(value: number | undefined) {
    if (value === undefined) {
      return;
    }

    if (value < 0) {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'color',
        this.wattColorService.getColor(WattColor.danger)
      );
    }
  }
}
