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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VATER, VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';
import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import { DhActorConversationListComponent } from '../actor-conversation-list';
import { DhActorConversationDetailsComponent } from '../actor-conversation-details.component';
import { DhGlobalNewConversationComponent } from './global-new-conversation.component';
import { ActorConversationStore } from '../actor-conversation.store';

@Component({
  selector: 'dh-global-conversation-shell',
  imports: [
    TranslocoDirective,
    VATER,
    WATT_CARD,
    WattEmptyStateComponent,
    WattButtonComponent,
    DhActorConversationListComponent,
    DhGlobalNewConversationComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattSpinnerComponent,
    DhActorConversationDetailsComponent,
  ],
  providers: [ActorConversationStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      --case-min-row-height: 82px;
    }

    .list-min-width {
      min-width: 400px;
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
          class="list-min-width"
          [conversationsQuery]="store.conversationsQuery"
          [newConversationVisible]="store.newConversationVisible()"
          [selectedConversationId]="store.selectedConversationId()"
          (createNewConversation)="store.openNewConversation()"
          (filter)="store.search($event)"
          (selectConversation)="store.selectConversation($event)"
        />
        <vater-stack scrollable *transloco="let t; prefix: 'meteringPoint.actorConversation'">
          @switch (store.state()) {
            @case ('newConversationOpen') {
              <dh-global-new-conversation
                vater
                fill="both"
                class="watt-space-inset-ml"
                (closeNewConversation)="store.closeNewConversation($event)"
              />
            }
            @case ('noConversations') {
              <watt-empty-state
                vater
                center
                icon="custom-cooperation"
                [title]="t('emptyState.noCases')"
              >
                <watt-button variant="secondary" (click)="store.openNewConversation()">
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
              @if (store.selectedConversationId(); as conversationId) {
                <dh-actor-conversation-details
                  vater
                  fill="both"
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
export class DhGlobalConversationShellComponent {
  protected readonly store = inject(ActorConversationStore);
  // No metering point ID — store defaults to undefined, showing all conversations
}

