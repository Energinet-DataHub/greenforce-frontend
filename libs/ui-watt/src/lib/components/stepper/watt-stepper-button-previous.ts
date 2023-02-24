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
import { CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'watt-button[wattStepperPrevious]',
  standalone: true,
})
export class WattStepperButtonPreviousDirective extends CdkStepperPrevious {
  @Input() type: 'submit' | 'button' = 'submit';
  @HostBinding('class') classes = 'watt-stepper-previous';
  @HostBinding('attr.type') get typeAttr() {
    return this.type;
  }
}
