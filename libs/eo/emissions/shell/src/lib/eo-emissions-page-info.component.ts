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
import { Router } from '@angular/router';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { EoEmissionsDataComponent } from './eo-emissions-data.component';
import { EoEmissionsStore } from './eo-emissions.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, WattButtonModule, EoEmissionsDataComponent],
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
          min-height: 42px;
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <h4>Your emissions in 2021</h4>
      <eo-emissions-data class="output watt-space-stack-m"></eo-emissions-data>
      <watt-button variant="text" icon="save" (click)="openSurvey()">
        Export details
      </watt-button>
    </mat-card>
  `,
})
export class EoEmissionsPageInfoComponent {
  loadingDone$ = this.store.loadingDone$;
  totalCO2$ = this.store.total$;

  constructor(private store: EoEmissionsStore, private router: Router) {}

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
