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
  selector: 'eo-origin-of-energy-hourly-declaration',
  template: `<mat-card class="description-card">
    <p class="watt-space-stack-m"><strong>Hourly Declaration</strong></p>
    <p class="watt-space-stack-m">
      The hourly declaration describes the origin of the energy you have consumed within a given
      period as well as the corresponding emissions.
    </p>
    <p>
      The declaration is calculated as a weighted average based on your hourly electricity
      consumption and the corresponding hourly residual mix in your bidding zone.
    </p>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .description-card {
        gap: var(--watt-space-m);
      }
    `,
  ],
})
export class EoOriginOfEnergyHourlyDeclarationComponent {}
