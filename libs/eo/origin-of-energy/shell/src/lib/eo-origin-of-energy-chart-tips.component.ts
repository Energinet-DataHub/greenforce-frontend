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
  selector: 'eo-origin-of-energy-chart-tips',
  template: `
    <mat-card class="tip-card">
      <div class="tip-card-header">
        <img
          class="lightbulb-icon"
          src="/assets/icons/lightbulb.svg"
          alt="Global goal 7.2"
        />
        <h1>Tip</h1>
      </div>
      <p>
        You can increase your share of renewable energy by shifting your
        consumption to periods with more renewable energy in the grid.
      </p>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .lightbulb-icon {
        width: 70px; /* Magic UX image size*/
      }

      .tip-card {
        background-color: var(--watt-color-primary-light);
        border-radius: var(--watt-space-m);
      }

      .tip-card-header {
        display: flex;
        align-items: center;
        margin-bottom: var(--watt-space-m);
        gap: calc(var(--watt-space-l) - var(--watt-space-s));
      }
    `,
  ],
})
export class EoOriginOfEnergyChartTipsComponent {}
