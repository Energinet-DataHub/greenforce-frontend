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
import { Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { MeteringPointDetails } from './types';

@Component({
  selector: 'dh-metering-point-highlights',
  imports: [TranslocoDirective, VaterStackComponent, VaterFlexComponent, WattIconComponent],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
    }

    .watt-chip-label--with-padding {
      @include watt.space-inset-squish-s;
    }
  `,
  template: `
    <div
      *transloco="let t; read: 'meteringPoint.overview.highlights'"
      vater-flex
      direction="row"
      gap="s"
      grow="0"
      wrap="wrap"
    >
      @if (hasHeatPump()) {
        <div
          vater-stack
          direction="row"
          gap="s"
          class="watt-chip-label watt-chip-label--with-padding"
        >
          <watt-icon size="m" name="heatPump" />
          <span class="watt-text-s">{{ t('electricalHeating') }}</span>
        </div>
      }

      @if (!actualAddress()) {
        <div
          vater-stack
          direction="row"
          gap="s"
          class="watt-chip-label watt-chip-label--with-padding"
        >
          <watt-icon size="m" name="wrongLocation" />
          <span class="watt-text-s">{{ t('notActualAddress') }}</span>
        </div>
      }

      <div
        vater-stack
        direction="row"
        gap="s"
        class="watt-chip-label watt-chip-label--with-padding"
      >
        <watt-icon size="m" name="warning" state="default" />
        <span class="watt-text-s">{{ t('protectedAddress') }}</span>
      </div>

      @if (annualSettlement()) {
        <div
          vater-stack
          direction="row"
          gap="s"
          class="watt-chip-label watt-chip-label--with-padding"
        >
          <watt-icon size="m" name="solarPower" />
          <span class="watt-text-s">{{ t('annualSettlement') }}</span>
        </div>
      }
    </div>
  `,
})
export class DhMeteringPointHighlightsComponent {
  meteringPoint = input.required<MeteringPointDetails | undefined>();

  hasHeatPump = computed(
    () => this.meteringPoint()?.currentCommercialRelation?.currentElectricalHeatingPeriod ?? false
  );

  actualAddress = computed(
    () =>
      this.meteringPoint()?.currentMeteringPointPeriod?.installationAddress?.washInstruction ===
      'true'
  );

  annualSettlement = computed(
    () => this.meteringPoint()?.currentMeteringPointPeriod?.netSettlementGroup === '6'
  );
}
