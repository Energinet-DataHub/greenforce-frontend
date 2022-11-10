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
import { MatCardModule } from '@angular/material/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule],
  selector: 'eo-emissions-page-greenhouse-gasses',
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
      <img
        class="watt-space-stack-m"
        alt="Danish ministry of climate and energy utilities | EnergyOrigin"
        src="assets/images/emissions/danish-ministry-of-climate-energy-utilities.svg"
      />
      <h3 class="watt-space-stack-m">Greenhouse gases</h3>
      <p class="watt-space-stack-m">
        Greenhouse gases is a common term for the gases that contribute to the
        greenhouse effect. When the concentration of greenhouse gases in the
        atmosphere grows, it causes changes in the greenhouse effect, which
        overall causes the Earth's temperature to rise and thus changes the
        climate on Earth. The gases include the gases carbon dioxide (CO2),
        methane (CH4), nitrous oxide (N2O) and F-gases.
      </p>
      <p>
        Read more on the home page
        <a
          href="https://ens.dk/en/our-responsibilities/energy-climate-politics/greenhouse-gasses"
          target="_blank"
          rel="noopener noreferrer"
        >
          Danish Energy Agency - Greenhouse Gases</a
        >.
      </p>
    </mat-card>
  `,
})
export class EoEmissionsPageGreenhouseGassesComponent {}
