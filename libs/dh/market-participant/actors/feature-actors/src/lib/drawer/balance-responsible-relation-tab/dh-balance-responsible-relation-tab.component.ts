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
import { Component, effect, inject, input } from '@angular/core';

import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet-datahub/watt/vater';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhBalanceResponsibleRelationsTableComponent } from './table/dh-table.componen';
import { DhBalanceResponsibleRelationsStore } from './dh-balance-responsible-relation.store';
import { DhBalanceResponsibleRelationFilterComponent } from './dh-balance-responsible-relation-filter.component';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-tab',
  templateUrl: './dh-balance-responsible-relation-tab.component.html',
  styles: `
    :host {
      display: block;
    }

    watt-button {
      margin-left: auto;
    }

    .group-status-label {
      margin-left: 12rem;
    }
  `,
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,

    WattSpinnerComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    DhBalanceResponsibleRelationsTableComponent,
    DhBalanceResponsibleRelationFilterComponent,
  ],
  providers: [DhBalanceResponsibleRelationsStore],
})
export class DhBalanceResponsibleRelationTabComponent {
  store = inject(DhBalanceResponsibleRelationsStore);

  actor = input.required<DhActorExtended>();

  constructor() {
    effect(
      () => {
        this.store.updateFilters({
          balanceResponsibleWithNameId: null,
          energySupplierWithNameId: null,
          gridAreaId: null,
          search: null,
          status: null,
          actorId: this.actor().id,
          eicFunction: this.actor().marketRole ?? null,
        });
      },
      { allowSignalWrites: true }
    );
  }

  download() {
    const balanceResponsibleRelations = this.store.filteredRelations();

    if (!balanceResponsibleRelations) {
      return;
    }

    const columnsPath =
      'marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation.columns';

    const headers = [
      `"${translate(columnsPath + '.balanceResponsibleId')}"`,
      `"${translate(columnsPath + '.balanceResponsibleName')}"`,
      `"${translate(columnsPath + '.energySupplierId')}"`,
      `"${translate(columnsPath + '.energySupplierName')}"`,
      `"${translate(columnsPath + '.gridAreaId')}"`,
      `"${translate(columnsPath + '.meteringPointType')}"`,
      `"${translate(columnsPath + '.status')}"`,
      `"${translate(columnsPath + '.start')}"`,
      `"${translate(columnsPath + '.end')}"`,
    ];

    const lines = balanceResponsibleRelations.map((balanceResponsibleRelation) => [
      `"${balanceResponsibleRelation.balanceResponsibleWithName?.id ?? ''}"`,
      `"${balanceResponsibleRelation.balanceResponsibleWithName?.actorName.value ?? ''}"`,
      `"${balanceResponsibleRelation.energySupplierWithName?.id ?? ''}"`,
      `"${balanceResponsibleRelation.energySupplierWithName?.actorName.value ?? ''}"`,
      `"${balanceResponsibleRelation.gridArea?.code ?? ''}"`,
      `"${balanceResponsibleRelation.meteringPointType ?? ''}"`,
      `"${balanceResponsibleRelation.status}"`,
      `"${balanceResponsibleRelation.validPeriod.start}"`,
      `"${balanceResponsibleRelation.validPeriod.end ?? ''}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'balance-responsible-relations' });
  }
}
