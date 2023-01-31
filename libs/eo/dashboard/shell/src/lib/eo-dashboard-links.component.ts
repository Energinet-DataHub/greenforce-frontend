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
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

@Component({
  standalone: true,
  imports: [MatCardModule],
  selector: 'eo-dashboard-links',
  template: ` <mat-card>
    <h3 class="watt-space-stack-s">Links</h3>
    <ul>
      <li>
        <a
          href="https://ens.dk/en/our-responsibilities/energy-climate-politics"
          target="_blank"
          rel="noopener noreferrer"
          >Danish Energy Agency - Energy and Climate Politics</a
        ><br />The danish goverment policies around clomate and energy. Where
        you can read about the danish energy plan for the next 10 years.
      </li>
      <li>
        <a
          href="https://virksomhedsguiden.dk/content/temaer/groen_omstilling/"
          target="_blank"
          rel="noopener noreferrer"
          >Virksomhedsguiden.dk - Green transition (danish)</a
        ><br />Describe how companies can become more green, with a lot of
        instructions and templates.
      </li>
      <li>
        <a
          href="https://en.energinet.dk/Green-Transition"
          target="_blank"
          rel="noopener noreferrer"
          >Energinet - Green Transition</a
        ><br />Energinet provide data regarding the transition to a more green
        energy system in Denmark.
      </li>
      <li>
        <a
          href="https://www.iea.org/countries/denmark"
          target="_blank"
          rel="noopener noreferrer"
          >IEA - Denmark</a
        ><br />The International Energy Agency, is committed to shaping a secure
        and sustainable energy future for all and provide data and comparison on
        what they different countries are doing.
      </li>
    </ul>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      ul li {
        --circle-size: 8px; /* Magic UX number */
      }
    `,
  ],
})
export class EoDashboardLinksComponent {}
