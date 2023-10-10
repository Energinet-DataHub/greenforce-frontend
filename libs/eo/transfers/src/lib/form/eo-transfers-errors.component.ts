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
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'eo-transfers-errors',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      eo-transfers-errors {
        display: block;
        margin-top: var(--watt-space-xs);
        min-height: 36px;
        overflow: hidden;
        padding-left: var(--watt-space-s);
        position: relative;
        width: 100%;

        watt-field-error {
          @include watt.typography-watt-text-s;
          position: absolute;
          transition: opacity, transform 150ms linear;
          transform: translate3d(0, -100%, 0);
        }

        &.show-error watt-field-error {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
  ],
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
})
export class EoTransferErrorsComponent {
  @Input() showError = false;

  @HostBinding('class.show-error')
  get hasError() {
    return this.showError;
  }
}
