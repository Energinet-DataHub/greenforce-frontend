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
import { DhBalanceResponsibleRelationsTableComponent } from './table/dh-table.componen';

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

  public readonly eicFunction: typeof EicFunction = EicFunction;

  actor = input.required<DhActorExtended>();
  actorId = computed(() => this.actor().id);

  balanceResponsibleRelationsRaw = signal<DhBalanceResponsibleAgreements>([]);
  balanceResponsibleRelationsByType = signal<DhBalanceResponsibleAgreementsByType>([]);

  isLoading = signal(false);
  isError = signal(false);

  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier]);
  balanceResponsibleOptions$ = getActorOptions([EicFunction.BalanceResponsibleParty]);
  gridAreaOptions$ = getGridAreaOptions();

  searchEvent = new EventEmitter<string>();

  filterForm = this.fb.group({
    status: [],
    energySupplier: [],
    gridArea: [],
    balanceResponsible: [],
  });

  constructor() {
    effect(() => this.fetchData(), { allowSignalWrites: true });
  }

  private fetchData() {
    this.isLoading.set(true);
    this.isError.set(false);

    this.apollo
      .watchQuery({
        query: GetBalanceResponsibleRelationDocument,
        variables: { id: this.actorId() },
      })
      .valueChanges.pipe()
      .subscribe({
        next: (result) => {
          this.isLoading.set(result.loading);

          this.balanceResponsibleRelationsRaw.set(
            result.data?.actorById.balanceResponsibleAgreements ?? []
          );

          this.balanceResponsibleRelationsByType.set(
            dhGroupBalanceResponsibleAgreements(this.balanceResponsibleRelationsRaw())
          );
        },
        error: () => {
          this.isLoading.set(false);
          this.isError.set(true);
        },
      });
  }
}
