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
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [MatCardModule],
  selector: 'eo-origin-of-energy-what-is-it',
  template: `<mat-card class="description-card">
    <p class="watt-space-stack-m"><strong>What is it?</strong></p>
    <table>
      <th width="200">Renewables</th>
      <th>Other</th>
      <tr>
        <td>
          Wind Offshore<br />
          Wind Onshore<br />
          Biogas <br />
          Solar <br />
          Hydro <br />
          Biomass (incl. wood)<br />
          Other renewable<br />
          Waste, 55%
        </td>
        <td>
          Fossil Brown coal/Lignite<br />
          Fossil Hard coal<br />
          Fossil Gas<br />
          Fossil Oil<br />
          Nuclear <br />
          Waste, 45%
        </td>
      </tr>
    </table>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .description-card {
        gap: var(--watt-space-m);
      }

      th {
        text-align: left;
      }

      td {
        vertical-align: top;
      }
    `,
  ],
})
export class EoOriginOfEnergyWhatIsItComponent {}
