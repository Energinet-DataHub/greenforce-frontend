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
import { computed, effect, Injectable, signal } from '@angular/core';
import { translate } from '@ngneat/transloco';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import {
  EicFunction,
  GetBalanceResponsibleRelationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';

import {
  DhBalanceResponsibleRelation,
  DhBalanceResponsibleRelationFilters,
  DhBalanceResponsibleRelations,
} from './dh-balance-responsible-relation';
import {
  dhGroupByMarketParticipant,
  dhGroupByType,
} from '../util/dh-group-balance-responsible-relations';
import { dhApplyFilter } from './dh-apply-filter';

@Injectable()
export class DhBalanceResponsibleRelationsStore {
  private balanceResponsibleRelationsQuery = lazyQuery(GetBalanceResponsibleRelationDocument);

  private relations = computed<DhBalanceResponsibleRelations>(
    () =>
      this.balanceResponsibleRelationsQuery.data()?.actorById?.balanceResponsibleAgreements ?? []
  );
  private actor = signal<DhActorExtended | null>(null);
  private filters = signal<DhBalanceResponsibleRelationFilters>({
    status: null,
    energySupplierWithNameId: null,
    gridAreaCode: null,
    balanceResponsibleWithNameId: null,
    search: null,
  });

  public filteredRelations = computed<DhBalanceResponsibleRelations>(() =>
    this.relations().filter(
      (relation) =>
        dhApplyFilter(this.filters(), relation) &&
        applySearch(this.filters(), relation, this.actor())
    )
  );

  public isLoading = this.balanceResponsibleRelationsQuery.loading;
  public hasError = this.balanceResponsibleRelationsQuery.hasError;

  public filteredAndGroupedRelations = computed(() => {
    if (this.actor()?.marketRole === EicFunction.EnergySupplier)
      return dhGroupByMarketParticipant(
        dhGroupByType(this.filteredRelations()),
        'balanceResponsibleWithName'
      );

    return dhGroupByMarketParticipant(
      dhGroupByType(this.filteredRelations()),
      'energySupplierWithName'
    );
  });

  public isEmpty = computed(() => this.filteredRelations().length === 0);

  constructor() {
    effect(() => {
      const actorId = this.actor()?.id;

      if (actorId == undefined) {
        return;
      }

      this.balanceResponsibleRelationsQuery.refetch({ id: actorId });
    });
  }

  public updateActor(actor: DhActorExtended | null): void {
    this.actor.set(actor);
  }

  public updateFilters(filters: Partial<DhBalanceResponsibleRelationFilters>): void {
    this.filters.update((prev) => ({ ...prev, ...filters }));
  }

  public download(): void {
    const balanceResponsibleRelations = this.filteredRelations();

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

    exportToCSV({ headers, lines, fileName: 'DataHub-Balance-responsible-relations' });
  }
}

const applySearch = (
  filters: DhBalanceResponsibleRelationFilters,
  balanceResponsibilityAgreement: DhBalanceResponsibleRelation,
  actor: DhActorExtended | null
) => {
  const { search } = filters;
  const { gridArea, balanceResponsibleWithName, energySupplierWithName } =
    balanceResponsibilityAgreement;

  if (search === null || search === undefined) {
    return true;
  }

  if (gridArea?.code === search) {
    return true;
  }

  if (
    actor?.marketRole === EicFunction.EnergySupplier &&
    balanceResponsibleWithName?.actorName.value
      ?.toLocaleLowerCase()
      .includes(search.toLocaleLowerCase())
  ) {
    return true;
  }

  return (
    actor?.marketRole === EicFunction.BalanceResponsibleParty &&
    energySupplierWithName?.actorName.value
      ?.toLocaleLowerCase()
      .includes(search.toLocaleLowerCase())
  );
};
