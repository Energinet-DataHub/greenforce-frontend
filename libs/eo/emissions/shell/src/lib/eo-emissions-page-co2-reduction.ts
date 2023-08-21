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
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-emissions-page-co2-reduction',
  styles: [
    `
      :host {
        outline: 1px solid var(--watt-color-state-warning);
        display: flex;
      }

      div {
        padding-right: 8px;
      }
    `,
  ],
  template: `
    <img
      alt="CO2 reduction | EnergyOrigin"
      src="/assets/icons/co2-cloud.svg"
      style="height: 160px;"
    />
    <div class="watt-space-inset-squish-m">
      <p>
        Denmark must <strong>reduce</strong> greenhouse gas <strong>emissions</strong> by
        <strong>70 percent</strong> in 2030 compared to 1990 [Klimaloven]
      </p>
    </div>
  `,
})
export class EoEmissionsPageCo2ReductionComponent {}
