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
import { Directive, HostBinding, Input } from '@angular/core';

export type Fill = 'horizontal' | 'vertical' | 'both';
export type Inset = '0' | 'xs' | 's' | 'm' | 'ml' | 'l' | 'xl';

/* eslint-disable @angular-eslint/no-input-rename */
@Directive({
  selector: '[vater]',
  standalone: true,
})
export class VaterUtilityDirective {
  /** Stretch the element to fill the available space in one or both directions. */
  @Input({ transform: (value: Fill) => `vater-fill-${value}` })
  fill?: Fill;

  /** Position the element absolute with the provided inset value. */
  @Input({ transform: (value: Inset) => `vater-inset-${value}` })
  inset?: Inset;

  @Input()
  center?: string;

  @HostBinding('class')
  get _class() {
    return [this.fill, this.inset].filter(Boolean);
  }

  @HostBinding('class.vater-center')
  get _center() {
    return this.center === '';
  }
}
