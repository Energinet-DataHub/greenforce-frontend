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
import { Router } from '@angular/router';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { EoEmissionsStore } from './eo-emissions.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-emissions-data',
  styles: [
    `
      :host {
        display: block;
      }

      .data-container {
        display: flex;
        align-items: flex-end;
        gap: 12px; /* Magic UX number */
        min-height: 42px; /* To prevent height change after loading data */
      }
    `,
  ],
  template: `
    <div class="data-container">
      <h1 *ngIf="loadingDone$ | async; else loading">
        {{ convertToKg((totalCO2$ | async)?.value || 0).toLocaleString() }} kg
      </h1>
      <h3>CO<sub>2</sub></h3>
    </div>

    <ng-template #loading
      ><watt-spinner [diameter]="36"></watt-spinner
    ></ng-template>
  `,
})
export class EoEmissionsDataComponent {
  loadingDone$ = this.store.loadingDone$;
  totalCO2$ = this.store.total$;

  constructor(private store: EoEmissionsStore, private router: Router) {}

  convertToKg(num: number): number {
    if (!num || Number.isNaN(num)) return 0;

    return Number((num / 1000).toFixed(0));
  }
}

@NgModule({
  declarations: [EoEmissionsDataComponent],
  exports: [EoEmissionsDataComponent],
  imports: [CommonModule, WattSpinnerModule],
})
export class EoEmissionsDataScam {}
