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
import { Component } from '@angular/core';
// import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

// import { WattDatePipe } from '@energinet-datahub/watt/date';
// import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
// import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
// import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';

// import { GetCommercialRelationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
// import { CommercialRelation } from '../types';
// import { queryTime } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-commercial-relations',
  imports: [
    // TranslocoPipe,
    // TranslocoDirective,
    // WATT_TABLE,
    // WattDatePipe,
    // WattDataTableComponent,
    // WattDataFiltersComponent,
    // VaterUtilityDirective,
  ],
  template: `
    <!-- <watt-data-table
      vater
      inset="ml"
      *transloco="let t; read: 'electricityMarket.table'"
      [searchLabel]="'shared.search' | transloco"
      [error]="commercialRelations.error"
      [ready]="commercialRelations.called"
      [queryTime]="commercialRelationsQueryTime()"
    >
      <h3>Commercial relations</h3>

      <watt-data-filters>
        <div>{{ t('meteringPointId', { id: meteringPointId() }) }}</div>
      </watt-data-filters>

      <watt-table
        [dataSource]="commercialRelations"
        [columns]="columns"
        [loading]="commercialRelations.loading"
      >
        <ng-container *wattTableCell="columns.createdAt; let element">
          {{ element.endDate | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.modifiedAt; let element">
          {{ element.modifiedAt | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.endDate; let element">
          {{ element.endDate | wattDate }}
        </ng-container>
      </watt-table>
    </watt-data-table> -->
  `,
})
export class DhCommercialRelationsComponent {
  // columns: WattTableColumnDef<CommercialRelation> = {
  //   id: { accessor: 'id' },
  //   meteringPointId: { accessor: 'meteringPointId' },
  //   endDate: { accessor: 'endDate' },
  //   modifiedAt: { accessor: 'modifiedAt' },
  //   startDate: { accessor: 'startDate' },
  //   energySupplier: { accessor: 'energySupplier' },
  // };
  // commercialRelations = new GetCommercialRelationsDataSource({ skip: true });
  // meteringPointId = computed(
  //   () => this.commercialRelations.query.data()?.meteringPointWithHistory.meteringPointId
  // );
  // commercialRelationsQueryTime = queryTime(this.commercialRelations.query);
}
