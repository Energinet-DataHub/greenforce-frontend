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
import { Component, EventEmitter, OnChanges, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { getGridAreaOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { RxPush } from '@rx-angular/template/push';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import {
  BalanceResponsibilityAgreementStatus,
  EicFunction,
  GetActorsForEicFunctionDocument,
  GetBalanceResponsibleRelationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

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
    ReactiveFormsModule,
    VaterStackComponent,
    VaterFlexComponent,
    WattDropdownComponent,
    WattSearchComponent,
    DhDropdownTranslatorDirective,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    TranslocoDirective,
    RxPush,
    JsonPipe,
  ],
})
export class DhBalanceResponsibleRelationTabComponent implements OnChanges {
  private fb = inject(NonNullableFormBuilder);
  private apollo = inject(Apollo);
  private actorQuery = this.apollo.watchQuery({ query: GetBalanceResponsibleRelationDocument });

  actorId = input.required<string>();

  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  energySupplierOptions$ = this.getEnergySupplierOptions();
  gridAreaOptions$ = getGridAreaOptions();
  searchEvent = new EventEmitter<string>();

  balanceResponsibleRelations$ = this.actorQuery.valueChanges.pipe(takeUntilDestroyed());

  filterForm = this.fb.group({ status: [], energySupplier: [], gridArea: [] });

  ngOnChanges(): void {
    this.actorQuery.refetch({ id: this.actorId() });
  }

  private getEnergySupplierOptions(): Observable<WattDropdownOptions> {
    return this.apollo
      .query({
        query: GetActorsForEicFunctionDocument,
        variables: {
          eicFunctions: [EicFunction.EnergySupplier],
        },
      })
      .pipe(
        map((result) => result.data?.actorsForEicFunction),
        exists(),
        map((actors) =>
          actors.map((actor) => ({
            value: actor.glnOrEicNumber,
            displayValue: `${actor.glnOrEicNumber} • ${actor.name}`,
          }))
        )
      );
  }
}
