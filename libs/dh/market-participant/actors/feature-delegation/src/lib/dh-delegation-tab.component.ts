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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoDirective } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet-datahub/watt/vater';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import {
  ActorDelegationStatus,
  GetDelegationsForActorDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import { DhDelegations, DhDelegationsByType } from './dh-delegations';
import { DhDelegationsOverviewComponent } from './overview/dh-delegations-overview.component';
import { DhDelegationCreateModalComponent } from './create/dh-delegation-create-modal.component';
import { dhGroupDelegations } from './util/dh-group-delegations';

@Component({
    selector: 'dh-delegation-tab',
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
    templateUrl: './dh-delegation-tab.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        VaterFlexComponent,
        VaterStackComponent,
        VaterSpacerComponent,
        WattEmptyStateComponent,
        WattButtonComponent,
        WattSpinnerComponent,
        WattDropdownComponent,
        DhPermissionRequiredDirective,
        DhDropdownTranslatorDirective,
        DhDelegationsOverviewComponent,
    ]
})
export class DhDelegationTabComponent {
  private readonly modalService = inject(WattModalService);

  private delegationsForActorQuery = lazyQuery(GetDelegationsForActorDocument);

  actor = input.required<DhActorExtended>();
  isLoading = this.delegationsForActorQuery.loading;
  hasError = this.delegationsForActorQuery.hasError;

  private delegationsRaw = computed<DhDelegations>(
    () => this.delegationsForActorQuery.data()?.delegationsForActor ?? []
  );
  delegationsByType = signal<DhDelegationsByType>([]);

  isEmpty = computed(() => this.delegationsRaw().length === 0);

  statusControl = new FormControl<ActorDelegationStatus[] | null>(null);
  statusOptions = dhEnumToWattDropdownOptions(ActorDelegationStatus);

  constructor() {
    effect(() => {
      this.statusControl.reset();

      this.delegationsForActorQuery.refetch({ actorId: this.actor().id });
    });

    effect(() => this.delegationsByType.set(dhGroupDelegations(this.delegationsRaw())), {
      allowSignalWrites: true,
    });

    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.filterDelegations(value));
  }

  onSetUpDelegation() {
    this.modalService.open({ component: DhDelegationCreateModalComponent, data: this.actor() });
  }

  private filterDelegations(filter: ActorDelegationStatus[] | null) {
    const delegations = untracked(this.delegationsRaw);

    if (filter === null) {
      return this.delegationsByType.set(dhGroupDelegations(delegations));
    }

    const delegationsFiltered = delegations.filter((delegation) =>
      filter.includes(delegation.status)
    );

    this.delegationsByType.set(dhGroupDelegations(delegationsFiltered));
  }
}
