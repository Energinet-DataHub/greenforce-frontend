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
  input,
  signal,
  computed,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  GetConversationsDocument,
  MarkConversationReadDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';

import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattSeparatorComponent } from '@energinet/watt/separator';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';
import { VATER, VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';

import { ActorConversationState, Conversation } from '../types';
import { DhActorConversationListItemComponent } from './actor-conversation-list-item';
import { DhActorConversationDetailsComponent } from './actor-conversation-details.component';
import { ActorConversationFilter, ActorConversationFilterValue } from './actor-conversation-filter';
import { DhActorConversationNewConversationComponent } from './actor-conversation-new-conversation';

@Component({
  selector: 'dh-actor-conversation-shell',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    VATER,
    WATT_CARD,
    WattButtonComponent,
    WattHeadingComponent,
    VaterStackComponent,
    WattSpinnerComponent,
    WattHeadingComponent,
    VaterUtilityDirective,
    WattSeparatorComponent,
    WattEmptyStateComponent,
    DhResultComponent,
    ActorConversationFilter,
    DhActorConversationDetailsComponent,
    DhActorConversationListItemComponent,
    DhActorConversationNewConversationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    dh-actor-conversation-shell {
      --case-min-row-height: 82px;

      watt-button.watt-button--text {
        .mdc-button {
          padding: 0;
        }
      }

      .list-min-width {
        min-width: 450px;
      }

      .new-conversation {
        background-color: var(--bg-card);
      }

      .conversations {
        list-style: none;
      }
    }
  `,
  template: `
    <watt-card vater contain fill="vertical">
      <vater-grid
        inset="0"
        columns="minmax(min-content, 1fr) 3fr"
        gap="dividers"
        *transloco="let t; prefix: 'meteringPoint.actorConversation'"
      >
        <div vater scrollable class="list-min-width">
          <vater-stack sticky="top" *transloco="let t; prefix: 'meteringPoint.actorConversation'">
            <vater-stack
              fill="horizontal"
              class="new-conversation watt-space-inset-m"
              gap="m"
              align="start"
            >
              <vater-stack fill="horizontal" direction="row" justify="space-between" align="center">
                <h3 watt-heading>{{ t('cases') }}</h3>
                <watt-button
                  (click)="newConversation()"
                  icon="plus"
                  variant="text"
                  data-testid="new-conversation-button"
                >
                  {{ t('newCaseButton') }}
                </watt-button>
              </vater-stack>
              <dh-actor-conversation-filter
                [canSearchForMeteringPointId]="meteringPointId() === undefined"
                (filterChange)="filterChanged($event)"
              />
            </vater-stack>
            <watt-separator weight="regular" />
          </vater-stack>

          <dh-result [query]="conversationsQuery">
            <vater-grid gap="dividers" autoRows="minmax(var(--case-min-row-height), 1fr)">
              <ul vater fragment class="conversations">
                @if (newConversationVisible()) {
                  <li>
                    <dh-actor-conversation-list-item [selected]="newConversationVisible()" />
                  </li>
                }
                @for (conversationItem of conversations(); track conversationItem.id) {
                  <li>
                    <dh-actor-conversation-list-item
                      [conversation]="conversationItem"
                      [selected]="selectedConversationId() === conversationItem.id"
                      (click)="selectConversation(conversationItem)"
                    />
                  </li>
                }
              </ul>
            </vater-grid>
          </dh-result>
        </div>
        <vater-stack scrollable *transloco="let t; prefix: 'meteringPoint.actorConversation'">
          @switch (state()) {
            @case ('newConversationOpen') {
              <dh-actor-conversation-new-conversation
                vater
                fill="both"
                class="watt-space-inset-ml"
                [meteringPointId]="meteringPointId()"
                (closeNewConversation)="closeNewConversation($event)"
              />
            }
            @case ('noConversations') {
              <watt-empty-state
                vater
                center
                icon="custom-cooperation"
                [title]="t('emptyState.noCases')"
              >
                <watt-button variant="secondary" (click)="newConversationVisible.set(true)">
                  {{ t('newCaseButton') }}
                </watt-button>
              </watt-empty-state>
            }
            @case ('noConversationSelected') {
              <watt-empty-state
                vater
                center
                icon="custom-cooperation"
                [title]="t('emptyState.noCaseSelected')"
              />
            }
            @case ('conversationSelected') {
              @if (selectedConversationId(); as conversationId) {
                <dh-actor-conversation-details
                  vater
                  fill="both"
                  [conversationId]="conversationId"
                  [meteringPointId]="meteringPointId()"
                />
              } @else {
                <watt-spinner vater center />
              }
            }
          }
        </vater-stack>
      </vater-grid>
    </watt-card>
  `,
})
export class DhActorConversation {
  filterChanged(filterValue: ActorConversationFilterValue) {
    this.selectedConversationId.set(undefined);
    this.conversationsQuery.refetch({
      meteringPointIdentification: this.meteringPointId(),
      closed: filterValue.statusClosed,
      ownConversations: filterValue.ownCases,
      opened: filterValue.statusActive,
      unread: filterValue.showOnlyUnread,
      searchTerm: filterValue.search,
      subjects: filterValue.subjects,
    });
  }

  conversationsQuery = query(GetConversationsDocument, () => ({
    variables: {
      meteringPointIdentification: this.meteringPointId(),
    },
  }));
  readConversationMutation = mutation(MarkConversationReadDocument);

  meteringPointId = input<string | undefined>();
  newConversationVisible = signal(false);

  conversations = computed(
    () => this.conversationsQuery.data()?.conversationsForMeteringPoint?.conversations ?? []
  );

  selectedConversationId = signal<string | undefined>(undefined);

  state = computed<ActorConversationState>(() => {
    if (this.newConversationVisible()) {
      return ActorConversationState.newConversationOpen;
    } else if (this.conversations().length === 0) {
      return ActorConversationState.noConversations;
    } else if (this.selectedConversationId() === undefined) {
      return ActorConversationState.noConversationSelected;
    }
    return ActorConversationState.conversationSelected;
  });

  newConversation() {
    this.newConversationVisible.set(true);
    this.selectedConversationId.set(undefined);
  }

  closeNewConversation(newConversationId?: string) {
    this.newConversationVisible.set(false);
    if (newConversationId) {
      this.selectedConversationId.set(newConversationId);
    }
  }

  async selectConversation(conversation: Conversation) {
    this.newConversationVisible.set(false);
    this.selectedConversationId.set(conversation.id);
    if (conversation.read) {
      return;
    }
    await this.readConversationMutation.mutate({
      variables: {
        conversationId: conversation.id,
      },
      refetchQueries: [GetConversationsDocument],
    });
  }
}
