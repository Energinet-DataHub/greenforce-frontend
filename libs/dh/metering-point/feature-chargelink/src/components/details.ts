//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WATT_MENU } from '@energinet/watt/menu';
import { WATT_TABLE, WattTableColumnDef, dataSource } from '@energinet/watt/table';
import { WattDataTableComponent } from '@energinet/watt/data';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatePipe } from '@energinet/watt/date';
import {
  DhChargePeriodPipe,
  DhChargesStatus,
} from '@energinet-datahub/dh/charges/feature-ui-shared';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattIconComponent } from '@energinet/watt/icon';
import { GetChargeLinkPeriodByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { ChargeLinkPeriod, ChargeLinkPeriodChange } from '../types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-charge-link-details',
  imports: [
    RouterLink,
    RouterOutlet,
    TranslocoDirective,
    VATER,
    WATT_DRAWER,
    WATT_DESCRIPTION_LIST,
    WATT_MENU,
    WATT_TABLE,
    WattDataTableComponent,
    WattDatePipe,
    DhChargePeriodPipe,
    DhChargesStatus,
    WattButtonComponent,
    WattIconComponent,
    WattHeadingComponent,
    DhPermissionRequiredDirective,
  ],

  template: `
    <watt-drawer
      size="small"
      [autoOpen]="item()"
      [key]="item()"
      (closed)="item.set(undefined)"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.details'"
    >
      <watt-drawer-heading>
        <vater-stack align="start" gap="s">
          <h2 watt-heading size="1" fill="horizontal">
            {{ item()?.charge?.displayName }}
          </h2>
          <vater-stack
            align="end"
            fill="horizontal"
            justify="space-between"
            gap="m"
            direction="row"
          >
            <vater-stack gap="s" direction="row">
              <watt-description-list variant="inline-flow">
                <watt-description-list-item
                  [label]="t('period')"
                  [value]="item()?.period | dhChargePeriod"
                />
              </watt-description-list>
              @if (isCancelled()) {
                <dh-charges-status [status]="'CANCELLED'" />
              }
            </vater-stack>
            <ng-container *dhPermissionRequired="['metering-point:prices-manage']">
              <watt-button variant="secondary" [wattMenuTriggerFor]="actions">
                {{ t('actions') }}
                <watt-icon name="moreVertical" />
              </watt-button>
              <watt-menu #actions>
                @if (chargeType() !== 'TARIFF' && chargeType() !== 'TARIFF_TAX') {
                  <watt-menu-item [routerLink]="['edit', item()?.id]">
                    {{ t('edit') }}
                  </watt-menu-item>
                }
                <watt-menu-item [routerLink]="['stop', item()?.id]">
                  {{ t('stop') }}
                </watt-menu-item>
                @if (!item()?.period?.end) {
                  <watt-menu-item [routerLink]="['cancel', item()?.id]">
                    {{ t('cancel') }}
                  </watt-menu-item>
                }
              </watt-menu>
            </ng-container>
          </vater-stack>
        </vater-stack>
      </watt-drawer-heading>
      <router-outlet />
      <watt-drawer-content>
        <watt-data-table
          [autoSize]="true"
          [header]="false"
          [enablePaginator]="false"
          [error]="details.error()"
          [ready]="details.called()"
        >
          <watt-table
            *transloco="let resolveHeader; prefix: 'meteringPoint.chargeLinks.details.columns'"
            [resolveHeader]="resolveHeader"
            [columns]="historyColumns"
            [dataSource]="historyDataSource"
            [loading]="details.loading()"
            sortBy="created"
            sortDirection="desc"
          >
            <ng-container *wattTableCell="historyColumns.created; let change">
              {{ change.created | wattDate: 'long' }}
            </ng-container>
            <ng-container *wattTableCell="historyColumns.description; let change">
              {{
                t('changeTypes.' + change.changeType, {
                  date: change.effectiveDate | wattDate,
                  factor: change.factor,
                  previousFactor: change.previousFactor,
                })
              }}
            </ng-container>
          </watt-table>
        </watt-data-table>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhChargeLinkDetails {
  readonly item = model<ChargeLinkPeriod>();
  readonly chargeType = computed(() => this.item()?.charge?.type);
  readonly isCancelled = computed(
    () => this.item()?.period?.start?.getTime() === this.item()?.period?.end?.getTime()
  );

  details = query(GetChargeLinkPeriodByIdDocument, () => {
    const id = this.item()?.id;
    return id ? { variables: { id } } : { skip: true };
  });

  changes = computed(() => this.details.data()?.chargeLinkPeriodById?.changes ?? []);
  historyDataSource = dataSource(() => this.changes());
  historyColumns: WattTableColumnDef<ChargeLinkPeriodChange> = {
    created: { accessor: (row) => row.created },
    description: { accessor: (row) => row.changeType, sort: false },
  };
}
