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
import { Component, ViewChild, effect, inject, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { RxPush } from '@rx-angular/template/push';

import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhDelegation, DhDelegations } from '../dh-delegations';
import { DhDelegationStatusComponent } from '../status/dh-delegation-status.component';
import { DhDelegationStopModalComponent } from '../stop/dh-delegation-stop-modal.component';

@Component({
  selector: 'dh-delegation-table',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.delegation.table'">
      <watt-table
        [dataSource]="tableDataSource"
        [columns]="columns"
        [selectable]="canManageDelegations()"
        [sortClear]="false"
        [suppressRowHoverHighlight]="true"
      >
        <ng-container
          *wattTableCell="columns['delegatedTo']; header: t('columns.delegatedTo'); let entry"
        >
          {{ entry.delegatedTo?.glnOrEicNumber }} • {{ entry.delegatedTo?.name }}
        </ng-container>

        <ng-container
          *wattTableCell="columns['gridArea']; header: t('columns.gridArea'); let entry"
        >
          <span>{{ entry.gridArea?.code }}</span>
        </ng-container>

        <ng-container *wattTableCell="columns['period']; header: t('columns.period'); let entry">
          @if (entry.status === 'CANCELLED') {
            {{ null | dhEmDashFallback }}
          } @else {
            {{ entry.validPeriod.start | wattDate: 'short' }}
            @if (entry.validPeriod.end) {
              -
              {{ entry.validPeriod.end | wattDate: 'short' }}
            }
          }
        </ng-container>

        <ng-container *wattTableCell="columns['status']; header: t('columns.status'); let entry">
          <dh-delegation-status [status]="entry.status" />
        </ng-container>

        <ng-container *wattTableToolbar="let selection">
          {{ selection.length }} {{ t('selectedRows') }}
          <watt-table-toolbar-spacer />
          <watt-button
            *transloco="let shared; read: 'marketParticipant.delegation.shared'"
            (click)="stopSelectedDelegations(selection)"
            icon="close"
          >
            {{ shared('stopDelegation') }}
          </watt-button>
        </ng-container>
      </watt-table>
    </ng-container>
  `,
  imports: [
    TranslocoDirective,
    RxPush,

    WATT_TABLE,
    WattDatePipe,
    WattButtonComponent,

    DhDelegationStatusComponent,
    DhEmDashFallbackPipe,
  ],
})
export class DhDelegationTableComponent {
  private readonly modalService = inject(WattModalService);

  tableDataSource = new WattTableDataSource<DhDelegation>([]);

  @ViewChild(WattTableComponent)
  table: WattTableComponent<DhDelegation> | undefined;

  columns: WattTableColumnDef<DhDelegation> = {
    delegatedTo: { accessor: null },
    gridArea: { accessor: null },
    period: { accessor: null },
    status: { accessor: null },
  };

  data = input.required<DhDelegations>();
  canManageDelegations = input.required<boolean>();

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.data();
    });
  }

  stopSelectedDelegations(selected: DhDelegation[]) {
    this.modalService.open({
      component: DhDelegationStopModalComponent,
      data: selected,
      onClosed: (result) => {
        if (result) {
          this.table?.clearSelection();
        }
      },
    });
  }
}
