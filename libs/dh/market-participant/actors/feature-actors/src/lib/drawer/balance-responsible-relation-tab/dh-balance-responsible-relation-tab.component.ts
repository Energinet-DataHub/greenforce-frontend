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
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';
import { Component, EventEmitter, computed, effect, inject, input, signal } from '@angular/core';
import { filter, map, switchMap, startWith, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import {
  BalanceResponsibilityAgreementStatus,
  EicFunction,
  GetBalanceResponsibleRelationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  getActorOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import {
  DhBalanceResponsibleAgreements,
  DhBalanceResponsibleAgreementsGrouped,
} from './dh-balance-responsible-relation';
import {
  dhGroupBalanceResponsibleRelationsByType,
  dhGroupByMarketParticipant,
} from '../util/dh-group-balance-responsible-relations';
import { DhBalanceResponsibleRelationsTableComponent } from './table/dh-table.componen';

function isNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value === null || value === undefined;
}

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-tab',
  templateUrl: './dh-balance-responsible-relation-tab.component.html',
  styles: `
    :host {
      watt-search {
        margin-left: auto;
      }
    }
  `,
  imports: [
    RxPush,
    TranslocoDirective,
    ReactiveFormsModule,

    VaterFlexComponent,
    VaterStackComponent,

    WattSearchComponent,
    WattDropdownComponent,
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

  private filterFormValueChanges$ = this.filterForm.valueChanges.pipe(takeUntilDestroyed());

  balanceResponsibleRelationsWithFilter$ = this.filterFormValueChanges$
    .pipe(
      startWith({ status: null, energySupplier: null, gridArea: null, balanceResponsible: null }),
      switchMap((filters) =>
        this.balanceResponsibleRelations$.pipe(
          filter((data) => data?.data?.actorById?.balanceResponsibleAgreements !== undefined),
          map((data) => data.data.actorById.balanceResponsibleAgreements),
          switchMap((balanceResponsibleAgreements) =>
            of(
              balanceResponsibleAgreements.filter(
                (x) =>
                  // If all filters are null, return all agreements
                  Object.values(filters).every((x) => x === null) ||
                  ((isNullOrUndefined(filters.status) || x.status === filters.status) &&
                    (isNullOrUndefined(filters.energySupplier) ||
                      x.energySupplierWithName?.id === filters.energySupplier) &&
                    (isNullOrUndefined(filters.gridArea) || x.gridAreaId === filters.gridArea) &&
                    (isNullOrUndefined(filters.balanceResponsible) ||
                      x.balanceResponsibleWithName?.id === filters.balanceResponsible))
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

  balanceResponsibleRelationsRaw = signal<DhBalanceResponsibleAgreements>([]);
  balanceResponsibleRelationsGrouped = signal<DhBalanceResponsibleAgreementsGrouped>([]);

  isLoading$ = this.balanceResponsibleRelations$.pipe(map((result) => result.loading));
  isError$ = this.balanceResponsibleRelations$.pipe(map((result) => result.error !== undefined));

  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier], 'actorId');
  balanceResponsibleOptions$ = getActorOptions([EicFunction.BalanceResponsibleParty], 'actorId');
  gridAreaOptions$ = getGridAreaOptions();

  searchEvent = new EventEmitter<string>();

  constructor() {
    effect(() => this.balanceResponsibleRelationsQuery.refetch({ id: this.actorId() }));
  }

  private handleSubscription(balanceResponsibleRelations: DhBalanceResponsibleAgreements | null) {
    if (balanceResponsibleRelations === null) return;

    this.balanceResponsibleRelationsRaw.set(balanceResponsibleRelations);

    this.balanceResponsibleRelationsGrouped.set([]);

    if (this.actor().marketRole === EicFunction.EnergySupplier) {
      this.balanceResponsibleRelationsGrouped.set(
        dhGroupByMarketParticipant(
          dhGroupBalanceResponsibleRelationsByType(this.balanceResponsibleRelationsRaw()),
          'balanceResponsibleWithName'
        )
      );
    } else {
      this.balanceResponsibleRelationsGrouped.set(
        dhGroupByMarketParticipant(
          dhGroupBalanceResponsibleRelationsByType(this.balanceResponsibleRelationsRaw()),
          'energySupplierWithName'
        )
      );
    }
  }
}
