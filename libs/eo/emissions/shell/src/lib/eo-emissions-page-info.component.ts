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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { EoEmissionsDataComponent } from './eo-emissions-data.component';
import { EoEmissionsStore } from './eo-emissions.store';
import { WATT_CARD } from '@energinet-datahub/watt/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WATT_CARD, WattButtonComponent, EoEmissionsDataComponent],
  selector: 'eo-emissions-page-info',
  styles: [
    `
      :host {
        display: block;
      }
      watt-card {
        background: var(--watt-color-state-warning-light);

        .output {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          min-height: 42px;
        }
      }
    `,
  ],
  template: `
    <watt-card>
      <h4>Your emissions in 2021</h4>
      <eo-emissions-data class="output watt-space-stack-m" />
      <watt-button variant="text" icon="save" (click)="openSurvey()"> Export details </watt-button>
    </watt-card>
  `,
})
export class EoEmissionsPageInfoComponent {
  private store = inject(EoEmissionsStore);
  private router = inject(Router);
  loadingDone$ = this.store.loadingDone$;
  totalCO2$ = this.store.total$;

  openSurvey() {
    this.router.navigate(['/emissions'], {
      queryParams: { showSurvey: true },
    });
  }

  convertToKg(num: number): number {
    if (!num || Number.isNaN(num)) return 0;

    return Number((num / 1000).toFixed(0));
  }
}
