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
import { Component, computed, inject, input } from '@angular/core';
import { GetChargeLinkHistoryDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { TranslocoDirective } from '@jsverse/transloco';
import { History } from '../types';
import { WATT_MENU } from '@energinet/watt/menu';
import { WattDataTableComponent } from '@energinet/watt/data';
import { WattDatePipe } from '@energinet/watt/core/date';
import { WattButtonComponent } from '@energinet/watt/button';

@Component({
  selector: 'dh-charge-link-details',
  imports: [
    WATT_DRAWER,
    WATT_TABLE,
    WATT_MENU,
    WattDatePipe,
    WattDataTableComponent,
    WattButtonComponent,
    TranslocoDirective,
  ],
  template: `
    <watt-drawer
      autoOpen
      [loading]="query.loading()"
      size="small"
      [key]="id()"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.details'"
      (closed)="navigation.navigate('list')"
    >
      <watt-drawer-heading
        ><h1>{{ chargeLinkWithHistory()?.displayName }}</h1></watt-drawer-heading
      >
      <watt-drawer-content>
        <watt-data-table [autoSize]="true" [header]="false" [enablePaginator]="false">
          <watt-table
            *transloco="let resolveHeader; prefix: 'meteringPoint.charges.details.columns'"
            [resolveHeader]="resolveHeader"
            [columns]="columns"
            [dataSource]="dataSource"
          >
            <ng-container *wattTableCell="columns.submittedAt; let history">
              {{ history.submittedAt | wattDate }}
            </ng-container>
            <ng-container *wattTableCell="columns.menu">
              <watt-button variant="icon" [wattMenuTriggerFor]="menu" icon="moreVertical" />
              <watt-menu #menu>
                <watt-menu-item>{{ t('copyMessage') }}</watt-menu-item>
                <watt-menu-item>{{ t('navigateToMessage') }}</watt-menu-item>
              </watt-menu>
            </ng-container>
          </watt-table>
        </watt-data-table>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export default class DhChargeLinkDetails {
  query = query(GetChargeLinkHistoryDocument, () => ({
    variables: { chargeLinkId: this.id(), meteringPointId: this.meteringPointId() },
  }));
  protected dataSource = dataSource(() => this.chargeLinkWithHistory()?.history || []);
  chargeLinkWithHistory = computed(() => this.query.data()?.chargeLinkById);
  navigation = inject(DhNavigationService);
  id = input.required<string>();
  meteringPointId = input.required<string>();

  protected columns = {
    submittedAt: { accessor: (row) => row.submittedAt },
    description: { accessor: (row) => row.description },
    menu: { accessor: null, header: '' },
  } satisfies WattTableColumnDef<History>;
}
