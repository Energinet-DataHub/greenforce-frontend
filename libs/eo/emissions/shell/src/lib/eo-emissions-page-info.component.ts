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
import { WattButtonComponent, WattButtonModule } from '@energinet-datahub/watt';
import { EoEmissionsStore } from './eo-emissions.store';

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
          align-items: end;
          gap: 12px;
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <h4>Your emissions in 2021</h4>
      <div class="output watt-space-stack-m">
        <h1>{{ (emissions$ | async)?.totalEmissions || '0' }} kg</h1>
        <h3>CO<sub>2</sub></h3>
      </div>
      <p>
        <watt-button variant="text" icon="save">Export details</watt-button>
      </p>
    </mat-card>
  `,
  viewProviders: [EoEmissionsStore],
})
export class EoEmissionsPageInfoComponent {
  emissions$ = this.emissionsStore.emissions$;

  constructor(private emissionsStore: EoEmissionsStore) {}
}

@NgModule({
  declarations: [EoEmissionsPageInfoComponent],
  imports: [MatCardModule, CommonModule, WattButtonModule],
  exports: [EoEmissionsPageInfoComponent],
})
export class EoEmissionsPageInfoScam {}
