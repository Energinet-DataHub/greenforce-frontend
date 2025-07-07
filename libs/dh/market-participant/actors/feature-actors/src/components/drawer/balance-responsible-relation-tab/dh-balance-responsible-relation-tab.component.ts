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
import { Component, effect, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhBalanceResponsibleRelationsTableComponent } from './table/dh-table.componen';
import { DhBalanceResponsibleRelationsStore } from './dh-balance-responsible-relation.store';
import { DhBalanceResponsibleRelationFilterComponent } from './dh-balance-responsible-relation-filter.component';

@Component({
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
    effect(() => this.store.updateActor(this.actor()));
  }
}
