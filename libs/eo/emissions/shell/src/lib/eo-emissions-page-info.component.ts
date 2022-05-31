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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WattButtonModule } from '@energinet-datahub/watt';
import { EoEmissionsService } from './eo-emissions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-emissions-page-info',
  styles: [
    `
      :host {
        display: block;
      }
      mat-card {
        background: var(--watt-color-state-warning-light);

        .output {
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <h4>Your emissions in 2021</h4>
      <div class="output watt-space-stack-m">
        <h1>{{ (emissions$ | async)?.total?.co2 || 0 }} kg</h1>
        <h3>CO<sub>2</sub></h3>
      </div>
    </mat-card>
  `,
})
export class EoEmissionsPageInfoComponent {
  emissions$ = this.eoEmissionsService.getEmissions();

  constructor(private eoEmissionsService: EoEmissionsService) {}
}

@NgModule({
  declarations: [EoEmissionsPageInfoComponent],
  imports: [MatCardModule, CommonModule, WattButtonModule],
  exports: [EoEmissionsPageInfoComponent],
})
export class EoEmissionsPageInfoScam {}
