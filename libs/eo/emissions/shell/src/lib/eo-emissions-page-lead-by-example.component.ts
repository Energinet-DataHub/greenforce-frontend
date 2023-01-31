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
  selector: 'eo-emissions-page-lead-by-example',
  styles: [
    `
      :host {
        display: block;
      }

      mat-card {
        background: var(--watt-color-neutral-white);
        img {
          display: block;
          width: 544px; // Magic number by designer
          height: 201px; // Magic number by designer
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <h3 class="watt-space-stack-m">
        <strong>CASE: Inspiration from Sønderborg municipality</strong>
      </h3>

      <img
        alt="Sonderborg leads the way | EnergyOrigin"
        class="watt-space-stack-m"
        src="assets/images/emissions/sonderborg-medals-row.svg"
      />
      <h3 class="watt-space-stack-m">
        Sønderborg is at the forefront of green energy transition
      </h3>
      <p class="watt-space-stack-m">
        Since 2007, Sønderborg has with ProjectZero focused on transitioning the
        entire area into a ZEROcarbon area by 2029, and carbon emissions have
        already been reduced by 1/2. The focus is on creating an intelligent and
        integrated energy system to save energy in a cost-effective where.
        Sønderborg's ProjectZero works with the green transition on corporate
        and private household level, and you can on how to reduce your own
        CO2-emission, for instance such as how to save up to 260 kg CO2 a year
        by lowering the room temperature. In addition to this, the Sønderborg
        <a
          href="https://www.smartcitysonderborg.dk/en-GB/buildings"
          target="_blank"
          rel="noopener noreferrer"
          >smart city platform</a
        >
        collects various energy related data to make citizens and local
        stakeholders aware of energy consumption and production in the area.
      </p>
      <p>
        Read more about
        <a
          href="https://www.projectzero.dk"
          target="_blank"
          rel="noopener noreferrer"
          >ProjectZero</a
        >.
      </p>
    </mat-card>
  `,
})
export class EoEmissionsPageLeadByExampleComponent {}
