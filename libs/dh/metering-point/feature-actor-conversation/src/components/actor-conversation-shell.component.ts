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
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { VATER, VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetConversationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';
import { WATT_CARD } from '@energinet/watt/card';
import { ActorConversationState } from '../types';
import { WattButtonComponent } from '@energinet/watt/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhActorConversationListComponent } from './actor-conversation-list';
import { DhActorConversationNewConversationComponent } from './actor-conversation-new-conversation';
import { DhActorConversationSelectedConversationComponent } from './actor-conversation-selected-conversation.component';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

@Component({
  selector: 'dh-actor-conversation-shell',
  imports: [
    TranslocoDirective,
    VATER,
    WATT_CARD,
    WattEmptyStateComponent,
    WattButtonComponent,
    DhActorConversationListComponent,
    DhActorConversationNewConversationComponent,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
    DhActorConversationSelectedConversationComponent,
    WattSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      --case-min-row-height: 82px;
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
        <dh-actor-conversation-list
          vater
          scrollable
          [conversationsQuery]="conversationsQuery"
          [newConversationVisible]="newConversationVisible()"
          [selectedConversationId]="selectedConversationId()"
          (createNewConversation)="newConversation()"
          (selectConversation)="selectConversation($event)"
        />
        <vater-stack scrollable *transloco="let t; prefix: 'meteringPoint.actorConversation'">
          @switch (state()) {
            @case ('newConversationOpen') {
              <dh-actor-conversation-new-conversation
                vater
                fill="both"
                class="watt-space-inset-m"
                [meteringPointId]="meteringPointId()"
                (closeNewConversation)="newConversationVisible.set(false)"
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
                <dh-actor-conversation-selected-conversation
                  vater
                  fill="both"
                  [meteringPointId]="meteringPointId()"
                  [conversationId]="conversationId"
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
export class DhActorConversationShellComponent {
  conversationsQuery = query(GetConversationsDocument, () => ({
    variables: {
      meteringPointIdentification: this.meteringPointId(),
    },
  }));

  meteringPointId = input.required<string>();
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

  selectConversation(conversationId?: string): void {
    this.newConversationVisible.set(false);
    this.selectedConversationId.set(conversationId);
  }
}
