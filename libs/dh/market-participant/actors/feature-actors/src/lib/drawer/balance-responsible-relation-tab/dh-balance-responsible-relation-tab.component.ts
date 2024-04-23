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
  DhBalanceResponsibleAgreementsByType,
} from './dh-balance-responsible-relation';
import { dhGroupBalanceResponsibleAgreements } from '../util/dh-group-balance-responsible-agreements';
import { filter, from, map, switchMap, tap, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
      startWith(null),
      switchMap((filters) =>
        this.balanceResponsibleRelations$.pipe(
          filter((data) => data?.data?.actorById?.balanceResponsibleAgreements !== undefined),
          map((data) => data.data.actorById.balanceResponsibleAgreements),
          switchMap((balanceResponsibleAgreements) =>
            from(
              filters
                ? balanceResponsibleAgreements.filter((x) => x.status === filters.status)
                : balanceResponsibleAgreements
            )
          )
        )
      ),
      tap((data) => console.log(data))
    )
    .subscribe((result) => {
      if (result === null) return;
      this.balanceResponsibleRelationsRaw.set([result]);

      this.balanceResponsibleRelationsByType.set(
        dhGroupBalanceResponsibleAgreements(this.balanceResponsibleRelationsRaw())
      );
    });

  public readonly eicFunction: typeof EicFunction = EicFunction;

  actor = input.required<DhActorExtended>();
  actorId = computed(() => this.actor().id);

  balanceResponsibleRelationsRaw = signal<DhBalanceResponsibleAgreements>([]);
  balanceResponsibleRelationsByType = signal<DhBalanceResponsibleAgreementsByType>([]);

  isLoading$ = this.balanceResponsibleRelations$.pipe(map((result) => result.loading));
  isError$ = this.balanceResponsibleRelations$.pipe(map((result) => result.error !== undefined));

  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier]);
  balanceResponsibleOptions$ = getActorOptions([EicFunction.BalanceResponsibleParty]);
  gridAreaOptions$ = getGridAreaOptions();

  searchEvent = new EventEmitter<string>();

  constructor() {
    effect(() => this.balanceResponsibleRelationsQuery.refetch({ id: this.actorId() }), {
      allowSignalWrites: true,
    });
  }
}
