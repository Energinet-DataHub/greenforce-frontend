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
import { EoMeteringPointsStore } from './eo-metering-points.store';

@Component({
  selector: 'eo-metering-points-list',
  styles: [
    `
      :host {
        display: block;
      }

      table {
        border-top: 1px solid var(--watt-color-primary-light);
        border-bottom: 1px solid var(--watt-color-primary-light);
      }

      .table-header {
        text-align: left;
        border-bottom: 1px solid var(--watt-color-primary-light);
        color: var(--watt-color-neutral-grey-900);
        padding: var(--watt-space-s) 0;
      }

      .table-cell {
        padding: 12px 64px 12px 0;
        width: 0%;
      }

      .first {
        padding-left: var(--watt-space-s);
      }

      .tag {
        display: inline-flex;
        background-color: var(--watt-color-primary-light);
        padding: var(--watt-space-xs) var(--watt-space-m);
        text-transform: capitalize;
        border-radius: var(--watt-space-m);
      }
    `,
  ],
  template: `<ng-container *ngIf="meteringPoints$ | async as meteringPoints">
    <table [cellPadding]="0" [cellSpacing]="0" width="100%">
      <tr>
        <th class="table-header first">ID</th>
        <th class="table-header">Address</th>
        <th class="table-header">Tags</th>
      </tr>
      <tr *ngIf="(loadingDone$ | async) === false">
        <td colspan="3" class="table-cell">Loading metering points ...</td>
      </tr>
      <tr *ngIf="meteringPoints.length === 0 && (loadingDone$ | async)">
        <td colspan="3" class="table-cell">
          You do not have any metering points.
        </td>
      </tr>
      <ng-container *ngFor="let point of meteringPoints">
        <tr>
          <td class="table-cell first">{{ point?.gsrn }}</td>
          <td>
            <ng-container *ngIf="point.address?.address1">
              {{ point.address.address1 + ',' }}
            </ng-container>
            <ng-container *ngIf="point.address?.address2">
              {{ point.address.address2 + ',' }}
            </ng-container>
            <ng-container *ngIf="point.address?.locality">
              {{ point.address.locality + ',' }}
            </ng-container>
            {{ point?.address?.postalCode }} {{ point?.address?.city }}
          </td>
          <td>
            <div class="tag">{{ point?.type }}</div>
          </td>
        </tr>
      </ng-container>
    </table>
  </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoMeteringPointListComponent {
  loadingDone$ = this.store.loadingDone$;
  meteringPoints$ = this.store.meteringPoints$;

  constructor(private store: EoMeteringPointsStore) {}
}

@NgModule({
  declarations: [EoMeteringPointListComponent],
  exports: [EoMeteringPointListComponent],
  imports: [CommonModule],
})
export class EoMeteringPointListScam {}
