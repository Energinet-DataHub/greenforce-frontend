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
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { GetDelegationsForActorDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhDelegationCreateModalComponent } from './dh-delegation-create-modal.component';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { DhDelegationsGrouped } from './dh-delegations';
import { DhDelegationsOverviewComponent } from './overview/dh-delegations-overview.component';
import { dhGroupDelegations } from './util/dh-group-delegations';
import { DhActorExtended } from '../../../domain/src/lib/dh-actor';

@Component({
  selector: 'dh-delegation-tab',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <vater-flex *transloco="let t; read: 'marketParticipant.delegation'">
      @if (isLoading()) {
        <vater-stack direction="row" justify="center">
          <watt-spinner />
        </vater-stack>
      } @else if (isEmpty()) {
        <vater-stack direction="row" justify="center">
          <watt-empty-state
            icon="custom-no-results"
            [title]="t('emptyTitle')"
            [message]="t('emptyMessage')"
          >
            <watt-button
              *dhPermissionRequired="['delegation:manage']"
              (click)="onSetUpDelegation()"
              variant="secondary"
            >
              {{ t('emptyStateSetUpDelegation') }}
            </watt-button>
          </watt-empty-state>
        </vater-stack>
      } @else {
        <dh-delegations-overview
          [outgoing]="delegationsGrouped().outgoing"
          [incoming]="delegationsGrouped().incoming"
          (setUpDelegation)="onSetUpDelegation()"
        />
      }
    </vater-flex>
  `,
  imports: [
    TranslocoDirective,

    VaterFlexComponent,
    VaterStackComponent,
    WattEmptyStateComponent,
    WattButtonComponent,
    WattSpinnerComponent,

    DhPermissionRequiredDirective,
    DhDelegationsOverviewComponent,
  ],
})
export class DhDelegationTabComponent {
  private readonly _modalService = inject(WattModalService);
  private readonly _apollo = inject(Apollo);

  actor = input.required<DhActorExtended>();
  isLoading = signal(false);

  delegationsGrouped = signal<DhDelegationsGrouped>({ outgoing: [], incoming: [] });

  isEmpty = computed(() => {
    return (
      this.delegationsGrouped().incoming.length === 0 &&
      this.delegationsGrouped().outgoing.length === 0
    );
  });

  constructor() {
    effect(() => this.fetchData(this.actor().id), { allowSignalWrites: true });
  }

  onSetUpDelegation() {
    this._modalService.open({ component: DhDelegationCreateModalComponent, data: this.actor() });
  }

  private fetchData(actorId: string) {
    this.isLoading.set(true);

    this._apollo
      .query({
        query: GetDelegationsForActorDocument,
        variables: { actorId },
      })
      .subscribe({
        next: (result) => {
          this.isLoading.set(result.loading);

          this.delegationsGrouped.set(
            dhGroupDelegations(result.data.getDelegationsForActor.delegations)
          );
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}
