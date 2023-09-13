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
import { NgIf } from '@angular/common';
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { TranslocoModule, translate } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { Subscription, takeUntil } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhEmDashFallbackPipe, emDash } from '@energinet-datahub/dh/shared/ui-util';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { GetActorByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActorExtended } from '../dh-actor';
import { DhActorStatusBadgeComponent } from '../status-badge/dh-actor-status-badge.component';

@Component({
  selector: 'dh-actor-drawer',
  standalone: true,
  templateUrl: './dh-actor-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .actor-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .actor-metadata {
        display: flex;
        gap: var(--watt-space-ml);
      }

      .actor-metadata__item {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }
    `,
  ],
  imports: [
    NgIf,
    TranslocoModule,

    WATT_DRAWER,
    WATT_TABS,
    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
    DhActorStatusBadgeComponent,
  ],
})
export class DhActorDrawerComponent {
  private apollo = inject(Apollo);
  private subscription?: Subscription;

  private getActorByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorByIdDocument,
  });

  actor: DhActorExtended | undefined = undefined;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  public open(actorId: string): void {
    this.drawer?.open();

    this.loadActor(actorId);
  }

  onClose(): void {
    this.closed.emit();
  }

  get marketRoleOrFallback(): string {
    if (this.actor?.marketRole) {
      return translate('marketParticipant.marketRoles.' + this.actor.marketRole);
    }

    return emDash;
  }

  get gridAreaOrFallback() {
    return this.actor?.gridAreas?.[0]?.code ?? emDash;
  }

  private loadActor(id: string): void {
    this.subscription?.unsubscribe();

    this.getActorByIdQuery$.setVariables({ id });

    this.subscription = this.getActorByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.actor = result.data?.actorById;
        },
      });
  }
}
