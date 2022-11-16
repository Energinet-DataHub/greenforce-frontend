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
import { Component } from '@angular/core';
import { EoPieChartComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { LetModule } from '@rx-angular/template';
import { map } from 'rxjs';
import { EoOriginOfEnergyStore } from './eo-origin-of-energy.store';

@Component({
  standalone: true,
  imports: [EoPieChartComponent, CommonModule, WattSpinnerModule, LetModule],
  selector: 'eo-origin-of-energy-pie-chart',
  template: `
    <ng-container *rxLet="loadingDone$ as loadingDone">
      <div *ngIf="!loadingDone" class="loadingObfuscator onTop">
        <watt-spinner [diameter]="100"></watt-spinner>
        <div class="loadingText">
          <strong>
            Phew, loading is taking a while, but don't worry. It usually takes 3
            minutes, but soon it will be faster
          </strong>
        </div>
      </div>
      <ng-container *rxLet="renewableShare$ as share">
        <div *ngIf="loadingDone && share.length === 0" class="noDataText onTop">
          No data available, try a different date
        </div>
        <eo-pie-chart
          [data]="share"
          [labels]="['Renewable', 'Other']"
        ></eo-pie-chart
      ></ng-container>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }

      .onTop {
        z-index: 1;
      }

      .loadingObfuscator {
        text-align: center;
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: var(--watt-on-dark-high-emphasis);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .loadingText {
        width: 210px; /* Magic UX number */
      }

      .noDataText {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--watt-color-primary);
        font-weight: 600;
      }
    `,
  ],
})
export class EoOriginOfEnergyPieChartComponent {
  loadingDone$ = this.store.loadingDone$;
  renewableShare$ = this.store.renewableTotal$.pipe(
    map((res) => Number((res * 100).toFixed(0))),
    map((share) => (share ? [share, 100 - share] : []))
  );

  constructor(private store: EoOriginOfEnergyStore) {}
}
