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

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MENU } from '@energinet/watt/menu';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WattDatePipe } from '@energinet/watt/core/date';
import { WattModalService } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDataTableComponent } from '@energinet/watt/data';
import { VaterStackComponent, VaterSpacerComponent } from '@energinet/watt/vater';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetChargeLinkHistoryDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { History } from '../types';
import { DhMeteringPointEditChargeLink } from './edit';
import { DhMeteringPointStopChargeLink } from './stop';
// import { DhMeteringPointCancelChargeLink } from './cancel';

@Component({
  selector: 'dh-charge-link-details',
  imports: [
    TranslocoDirective,

    WATT_MENU,
    WATT_TABLE,
    WATT_DRAWER,
    WattDatePipe,
    WattButtonComponent,
    WattDataTableComponent,

    VaterStackComponent,
    VaterSpacerComponent,
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
      <watt-drawer-heading>
        <vater-stack direction="row">
          <h1>{{ chargeLinkWithHistory()?.displayName }}</h1>
          <vater-spacer />
          <watt-button variant="icon" [wattMenuTriggerFor]="actions" icon="moreVertical" />
          <watt-menu #actions>
            <watt-menu-item (click)="edit()">{{ t('edit') }}</watt-menu-item>
            <watt-menu-item (click)="stop()">{{ t('stop') }}</watt-menu-item>
            <watt-menu-item>{{ t('cancel') }}</watt-menu-item>
          </watt-menu>
        </vater-stack>
      </watt-drawer-heading>

      <watt-drawer-content>
        <watt-data-table [autoSize]="true" [header]="false" [enablePaginator]="false">
          <watt-table
            *transloco="let resolveHeader; prefix: 'meteringPoint.chargeLinks.details.columns'"
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
  private readonly modalService = inject(WattModalService);
  query = query(GetChargeLinkHistoryDocument, () => ({
    variables: { chargeLinkId: this.id(), meteringPointId: this.meteringPointId() },
  }));
  dataSource = dataSource(() => this.chargeLinkWithHistory()?.history || []);
  chargeLinkWithHistory = computed(() => this.query.data()?.chargeLinkById);
  navigation = inject(DhNavigationService);
  id = input.required<string>();
  meteringPointId = input.required<string>();

  columns = {
    submittedAt: { accessor: (row) => row.submittedAt },
    description: { accessor: (row) => row.description },
    menu: { accessor: null, header: '' },
  } satisfies WattTableColumnDef<History>;

  edit() {
    this.modalService.open({
      component: DhMeteringPointEditChargeLink,
    });
  }

  stop() {
    this.modalService.open({
      component: DhMeteringPointStopChargeLink,
    });
  }
}
