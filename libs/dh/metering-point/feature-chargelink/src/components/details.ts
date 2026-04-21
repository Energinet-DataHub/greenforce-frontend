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
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink, RouterOutlet } from '@angular/router';

import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WattDatePipe } from '@energinet/watt/core/date';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';
import { WATT_MENU } from '@energinet/watt/menu';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';

import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { ChargeLinkOverview } from '../types';
import { WattHeadingComponent } from '@energinet/watt/heading';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-charge-link-details',
  imports: [
    TranslocoDirective,
    WATT_DRAWER,
    WATT_DESCRIPTION_LIST,
    WATT_MENU,
    WattDatePipe,
    WattButtonComponent,
    WattIconComponent,
    WattHeadingComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    DhPermissionRequiredDirective,
    RouterLink,
    RouterOutlet,
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
            <watt-description-list variant="inline-flow">
              <watt-description-list-item
                [label]="t('period')"
                [value]="item()?.period | wattDate"
              />
            </watt-description-list>
            <ng-container *dhPermissionRequired="['metering-point:prices-manage']">
              <watt-button variant="secondary" [wattMenuTriggerFor]="actions">
                {{ t('actions') }}
                <watt-icon name="moreVertical" />
              </watt-button>
              <watt-menu #actions>
                @if (chargeType() !== 'TARIFF' && chargeType() !== 'TARIFF_TAX') {
                  <watt-menu-item [routerLink]="['edit', item()?.chargeLinkId]">
                    {{ t('edit') }}
                  </watt-menu-item>
                }
                <watt-menu-item [routerLink]="['stop', item()?.chargeLinkId]">
                  {{ t('stop') }}
                </watt-menu-item>
                @if (!item()?.period?.end) {
                  <watt-menu-item [routerLink]="['cancel', item()?.chargeLinkId]">
                    {{ t('cancel') }}
                  </watt-menu-item>
                }
              </watt-menu>
            </ng-container>
          </vater-stack>
        </vater-stack>
      </watt-drawer-heading>
      <router-outlet />
      <!-- TODO: Re-enable history
      <watt-drawer-content>
        <watt-data-table [autoSize]="true" [header]="false" [enablePaginator]="false">
          <watt-table
            *transloco="let resolveHeader; prefix: 'meteringPoint.chargeLinks.details.columns'"
            [resolveHeader]="resolveHeader"
            [columns]="historyColumns"
            [dataSource]="historyDataSource"
          >
            <ng-container *wattTableCell="historyColumns.submittedAt; let history">
              {{ history.submittedAt | wattDate }}
            </ng-container>
            <ng-container *wattTableCell="historyColumns.menu">
              <watt-button variant="icon" [wattMenuTriggerFor]="menu" icon="moreVertical" />
              <watt-menu #menu>
                <watt-menu-item>{{ t('copyMessage') }}</watt-menu-item>
                <watt-menu-item>{{ t('navigateToMessage') }}</watt-menu-item>
              </watt-menu>
            </ng-container>
          </watt-table>
        </watt-data-table>
      </watt-drawer-content>
      -->
    </watt-drawer>
  `,
})
export default class DhChargeLinkDetails {
  readonly item = model<ChargeLinkOverview>();
  readonly chargeType = computed(() => this.item()?.charge?.type);

  // TODO: Re-enable history
  // historyQuery = query(GetChargeLinkHistoryDocument, () => ({
  //   variables: { id: this.item()?.charge?.id ?? '' },
  // }));
  // historyDataSource = dataSource(() => this.historyQuery.data()?.chargeLinkById?.history || []);
  // historyColumns = {
  //   submittedAt: { accessor: (row: History) => row.submittedAt },
  //   description: { accessor: (row: History) => row.description },
  //   menu: { accessor: null, header: '', size: 'min-content' },
  // } satisfies WattTableColumnDef<History>;
}
