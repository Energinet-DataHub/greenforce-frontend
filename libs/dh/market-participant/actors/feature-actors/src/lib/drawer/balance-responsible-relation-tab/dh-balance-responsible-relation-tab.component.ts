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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';

import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';

import { map, switchMap, of, tap, catchError, combineLatestWith } from 'rxjs';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import {
  BalanceResponsibilityAgreement,
  EicFunction,
  GetBalanceResponsibleRelationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

import {
  DhBalanceResponsibleRelationFilters,
  DhBalanceResponsibleRelations,
  DhBalanceResponsibleRelationsGrouped,
} from './dh-balance-responsible-relation';

import {
  dhGroupByType,
  dhGroupByMarketParticipant,
} from '../util/dh-group-balance-responsible-relations';

import { DhBalanceResponsibleRelationsTableComponent } from './table/dh-table.componen';
import { DhBalanceResponsibleRelationsStore } from './dh-balance-responsible-relation.store';
import { DhBalanceResponsibleRelationFilterComponent } from './dh-balance-responsible-relation-filter.component';

function isNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value === null || value === undefined;
}

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
    ReactiveFormsModule,

    VaterFlexComponent,
    VaterStackComponent,

    WATT_EXPANDABLE_CARD_COMPONENTS,
    WattDatePipe,
    WattEmptyStateComponent,
    WattSpinnerComponent,

    DhBalanceResponsibleRelationsTableComponent,
    DhBalanceResponsibleRelationFilterComponent,
  ],
  providers: [DhBalanceResponsibleRelationsStore],
})
export class DhBalanceResponsibleRelationTabComponent {
  private apollo = inject(Apollo);
  private store = inject(DhBalanceResponsibleRelationsStore);
  private destroyRef = inject(DestroyRef);

  filters$ = this.store.filters$;
  isLoading = signal(false);
  hasError = signal(false);

  actor = input.required<DhActorExtended>();
  actorId = computed(() => this.actor().id);

  onFiltersEvent(filters: DhBalanceResponsibleRelationFilters): void {
    this.store.patchState((state) => ({
      ...state,
      filters,
    }));
  }

  balanceResponsibleRelationsWithFilter$ = this.store.queryVariables$
    .pipe(
      combineLatestWith(toObservable(this.actorId)),
      tap(() => this.isLoading.set(true)),
      tap(() => this.hasError.set(false)),
      switchMap(([{ filters }, id]) =>
        this.apollo
          .watchQuery({
            query: GetBalanceResponsibleRelationDocument,
            variables: { id },
          })
          .valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError((errors) => {
              console.log(errors);
              this.hasError.set(true);
              this.isLoading.set(false);
              this.balanceResponsibleRelationsRaw.set([]);
              return of({ loading: false, data: null, errors });
            }),
            tap(() => this.isLoading.set(false)),
            map((data) => data?.data?.actorById?.balanceResponsibleAgreements),
            exists(),
            switchMap((balanceResponsibleAgreements) =>
              of(
                balanceResponsibleAgreements.filter(
                  (x) =>
                    // If all filters are null, and search is empty return all agreements
                    Object.values(filters).every((x) => x === null) || this.applyFilter(filters, x)
                )
              )
            )
          )
      )
    )
    .subscribe((result) => this.handleSubscription(result));

  balanceResponsibleRelationsRaw = signal<DhBalanceResponsibleRelations>([]);
  balanceResponsibleRelationsGrouped = signal<DhBalanceResponsibleRelationsGrouped>([]);

  isEmpty = computed(() => this.balanceResponsibleRelationsRaw().length === 0);

  constructor() {
    effect(() => {
      console.log('actorId', this.actorId());
      // this.balanceResponsibleRelationsQuery.refetch({ id: this.actorId() });
    });
  }

  private applyFilter(
    filters: DhBalanceResponsibleRelationFilters,
    balanceResponsibilityAgreement: BalanceResponsibilityAgreement
  ) {
    return (
      (filters.status === null ||
        filters.status === undefined ||
        balanceResponsibilityAgreement.status === filters.status) &&
      (isNullOrUndefined(filters.balanceResponsibleWithNameId) ||
        balanceResponsibilityAgreement.energySupplierWithName?.id ===
          filters.balanceResponsibleWithNameId) &&
      (filters.gridAreaId === null ||
        filters.gridAreaId === undefined ||
        balanceResponsibilityAgreement.gridAreaId === filters.gridAreaId) &&
      (isNullOrUndefined(filters.balanceResponsibleWithNameId) ||
        balanceResponsibilityAgreement.balanceResponsibleWithName?.id ===
          filters.balanceResponsibleWithNameId) &&
      (filters.search === null ||
        filters.search === undefined ||
        this.applySearch(filters.search, balanceResponsibilityAgreement))
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
}
