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
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule],
  selector: 'eo-consumption-page-energy-consumption',
  styles: [
    `
      :host {
        display: block;
      }

      mat-card {
        img {
          display: block;
          width: 544px; // Magic number by designer
          height: 133px; // Magic number by designer
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <h3 class="watt-space-stack-m">Energy consumption in Denmark</h3>
      <p class="watt-space-stack-m">
        The most important measure in the energy balance of Denmark is the total consumption of
        <strong>33.02 billion kWh</strong> of electric energy per year. Per capita this is an
        <strong>average of 5.662 kWh</strong>.
      </p>
      <p>
        Denmark can partly provide itself with
        <strong>self-produced energy</strong>. The total production of all electric energy producing
        facilities is 30 bn kWh. That is 90% of the countries own usage. The rest of the needed
        energy is imported from foreign countries. Along with pure consumptions the production,
        imports and exports play an important role. Other energy sources such as natural gas or
        crude oil are also used.
        <a
          href="https://www.worlddata.info/europe/denmark/energy-consumption.php"
          target="_blank"
          rel="noopener noreferrer"
        >
          [WorldData]
        </a>
      </p>
    </mat-card>
  `,
})
export class EoConsumptionPageEnergyConsumptionComponent {}
