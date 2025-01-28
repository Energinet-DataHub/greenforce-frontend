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
import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-actual-address',
  imports: [TranslocoDirective, VaterFlexComponent, WattIconComponent],
  styles: `
    :host {
      display: block;
    }

    .actual-address-wrapper {
      align-items: center;
    }
  `,
  template: `
    <div
      *transloco="let t; read: 'meteringPoint.overview.addressDetails'"
      class="watt-text-s actual-address-wrapper"
      vater-flex
      direction="row"
      gap="s"
      grow="0"
    >
      @if (isActualAddress()) {
        <watt-icon name="location" state="success" size="s" />
        {{ t('actualAddress') }}
      } @else {
        <watt-icon name="wrongLocation" state="danger" size="s" />
        {{ t('notActualAddress') }}
      }
    </div>
  `,
})
export class DhActualAddressComponent {
  isActualAddress = input.required();
}
