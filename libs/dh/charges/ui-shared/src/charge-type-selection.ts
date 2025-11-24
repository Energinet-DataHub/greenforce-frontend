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
//#endregione';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { ChargeType } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-charge-type-selection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, VaterStackComponent, WattButtonComponent],
  template: `
    @if (!value()) {
      <vater-stack align="stretch" gap="m" offset="m">
        @for (chargeType of chargeTypes; track chargeType) {
          <watt-button variant="selection" icon="right" (click)="value.set(chargeType)">
            {{ 'charges.chargeTypes.' + chargeType | transloco }}
          </watt-button>
        }
      </vater-stack>
    } @else {
      <ng-content />
    }
  `,
})
export class DhChargeTypeSelection {
  chargeTypes = [ChargeType.Tariff, ChargeType.Subscription, ChargeType.Fee];
  value = model<ChargeType | null>(null);
}
