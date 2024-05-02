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
import { Apollo } from 'apollo-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, effect, inject, input, signal } from '@angular/core';

import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import {
  map,
  switchMap,
  startWith,
  of,
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
} from 'rxjs';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  exportToCSV,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  BalanceResponsibilityAgreement,
  BalanceResponsibilityAgreementStatus,
  EicFunction,
  GetBalanceResponsibleRelationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  getActorOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

import {
  DhBalanceResponsibleRelations,
  DhBalanceResponsibleRelationsGrouped,
} from './dh-balance-responsible-relation';

import {
  dhGroupByType,
  dhGroupByMarketParticipant,
} from '../util/dh-group-balance-responsible-relations';

import { DhBalanceResponsibleRelationsTableComponent } from './table/dh-table.componen';

function isNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value === null || value === undefined;
}

type FilterFormValue =
  | Partial<{
      status: never;
      energySupplier: never;
      gridArea: never;
      balanceResponsible: never;
    }>
  | {
      status: null;
      energySupplier: null;
      gridArea: null;
      balanceResponsible: null;
    };

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-tab',
  templateUrl: './dh-balance-responsible-relation-tab.component.html',
  styles: `
    :host {
      display: block;
    }

    watt-search {
      margin-left: auto;
    }

    .group-status-label {
      margin-left: 12rem;
    }
  `,
  imports: [
    RxPush,
    TranslocoDirective,
    TranslocoPipe,
    ReactiveFormsModule,

    VaterFlexComponent,
    VaterStackComponent,

    WattSearchComponent,
    WattDropdownComponent,
    WattButtonComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    WattDatePipe,

    DhDropdownTranslatorDirective,
    DhBalanceResponsibleRelationsTableComponent,
  ],
})
export class DhBalanceResponsibleRelationTabComponent {
  private fb = inject(NonNullableFormBuilder);
  private apollo = inject(Apollo);
  private balanceResponsibleRelationsQuery = this.apollo.watchQuery({
    query: GetBalanceResponsibleRelationDocument,
  });

  private balanceResponsibleRelations$ =
    this.balanceResponsibleRelationsQuery.valueChanges.pipe(takeUntilDestroyed());

  filterForm = this.fb.group({
    status: [],
    energySupplier: [],
    gridArea: [],
    balanceResponsible: [],
  });

  searchEvent$ = new BehaviorSubject<string>('');

  private filterFormValueChanges$ = this.filterForm.valueChanges.pipe(takeUntilDestroyed());

  balanceResponsibleRelationsWithFilter$ = this.filterFormValueChanges$
    .pipe(
      startWith({ status: null, energySupplier: null, gridArea: null, balanceResponsible: null }),
      combineLatestWith(this.searchEvent$.pipe(debounceTime(250))),
      switchMap(([filters, search]) =>
        this.balanceResponsibleRelations$.pipe(
          map((data) => data?.data?.actorById?.balanceResponsibleAgreements),
          exists(),
          switchMap((balanceResponsibleAgreements) =>
            of(
              balanceResponsibleAgreements.filter(
                (x) =>
                  // If all filters are null, and search is empty return all agreements
                  (Object.values(filters).every((x) => x === null) && search === '') ||
                  (this.applyFilter(filters, x) && this.applySearch(search, x))
              )
            )
          )
        )
      )
    )
    .subscribe((result) => this.handleSubscription(result));

  public readonly eicFunction: typeof EicFunction = EicFunction;

  actor = input.required<DhActorExtended>();
  actorId = computed(() => this.actor().id);

  balanceResponsibleRelationsRaw = signal<DhBalanceResponsibleRelations>([]);
  balanceResponsibleRelationsGrouped = signal<DhBalanceResponsibleRelationsGrouped>([]);

  isLoading$ = this.balanceResponsibleRelations$.pipe(map((result) => result.loading));
  isError$ = this.balanceResponsibleRelations$.pipe(map((result) => result.error !== undefined));

  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier], 'actorId');
  balanceResponsibleOptions$ = getActorOptions([EicFunction.BalanceResponsibleParty], 'actorId');
  gridAreaOptions$ = getGridAreaOptions();

  constructor() {
    effect(() => this.balanceResponsibleRelationsQuery.refetch({ id: this.actorId() }));
  }

  private applyFilter(
    filters: FilterFormValue,
    balanceResponsibilityAgreement: BalanceResponsibilityAgreement
  ) {
    return (
      (isNullOrUndefined(filters.status) ||
        balanceResponsibilityAgreement.status === filters.status) &&
      (isNullOrUndefined(filters.energySupplier) ||
        balanceResponsibilityAgreement.energySupplierWithName?.id === filters.energySupplier) &&
      (isNullOrUndefined(filters.gridArea) ||
        balanceResponsibilityAgreement.gridAreaId === filters.gridArea) &&
      (isNullOrUndefined(filters.balanceResponsible) ||
        balanceResponsibilityAgreement.balanceResponsibleWithName?.id ===
          filters.balanceResponsible)
    );
  }

  private applySearch(
    search: string,
    balanceResponsibilityAgreement: BalanceResponsibilityAgreement
  ) {
    return (
      balanceResponsibilityAgreement.gridAreaId === search ||
      (this.actor().marketRole === EicFunction.EnergySupplier &&
        balanceResponsibilityAgreement.balanceResponsibleWithName?.actorName.value
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())) ||
      (this.actor().marketRole === EicFunction.BalanceResponsibleParty &&
        balanceResponsibilityAgreement.energySupplierWithName?.actorName.value
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()))
    );
  }

  private handleSubscription(balanceResponsibleRelations: DhBalanceResponsibleRelations | null) {
    if (balanceResponsibleRelations === null) return;

    this.balanceResponsibleRelationsRaw.set(balanceResponsibleRelations);

    this.balanceResponsibleRelationsGrouped.set([]);

    if (this.actor().marketRole === EicFunction.EnergySupplier) {
      this.balanceResponsibleRelationsGrouped.set(
        dhGroupByMarketParticipant(
          dhGroupByType(this.balanceResponsibleRelationsRaw()),
          'balanceResponsibleWithName'
        )
      );
    } else {
      this.balanceResponsibleRelationsGrouped.set(
        dhGroupByMarketParticipant(
          dhGroupByType(this.balanceResponsibleRelationsRaw()),
          'energySupplierWithName'
        )
      );
    }
  }

  download() {
    const balanceResponsibleRelations = this.balanceResponsibleRelationsRaw();

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
      `"${balanceResponsibleRelation.gridAreaId}"`,
      `"${balanceResponsibleRelation.meteringPointType ?? ''}"`,
      `"${balanceResponsibleRelation.status}"`,
      `"${balanceResponsibleRelation.validPeriod.start}"`,
      `"${balanceResponsibleRelation.validPeriod.end ?? ''}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'balance-responsible-relations' });
  }
}
