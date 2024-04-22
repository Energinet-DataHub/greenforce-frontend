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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, OnChanges, computed, inject, input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';

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
  getEnergySupplierOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

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

    DhDropdownTranslatorDirective,
  ],
})
export class DhBalanceResponsibleRelationTabComponent implements OnChanges {
  private fb = inject(NonNullableFormBuilder);
  private apollo = inject(Apollo);
  private actorQuery = this.apollo.watchQuery({ query: GetBalanceResponsibleRelationDocument });

  actorId = input.required<DhActorExtended['id']>();
  marketRole = input.required<DhActorExtended['marketRole']>();

  isBalanceResponsibleParty = computed(() => {
    return this.marketRole() === EicFunction.BalanceResponsibleParty;
  });

  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  energySupplierOptions$ = getEnergySupplierOptions();
  gridAreaOptions$ = getGridAreaOptions();

  searchEvent = new EventEmitter<string>();

  balanceResponsibleRelations$ = this.actorQuery.valueChanges.pipe(takeUntilDestroyed());

  filterForm = this.fb.group({ status: [], energySupplier: [], gridArea: [] });

  ngOnChanges(): void {
    this.actorQuery.refetch({ id: this.actorId() });
  }
}
