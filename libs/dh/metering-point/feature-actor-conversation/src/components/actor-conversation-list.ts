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
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { WattButtonComponent } from '@energinet/watt/button';
import { VATER, VaterUtilityDirective } from '@energinet/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhActorConversationListItemComponent } from './actor-conversation-list-item';
import { Conversation } from '../types';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { QueryResult } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetConversationsQuery,
  GetConversationsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { dayjs } from '@energinet/watt/core/date';

@Component({
  selector: 'dh-actor-conversation-list',
  imports: [
    TranslocoDirective,
    VATER,
    WattButtonComponent,
    WattHeadingComponent,
    DhActorConversationListItemComponent,
    VaterUtilityDirective,
    DhResultComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .new-conversation {
      background-color: var(--bg-card);
    }

    .conversations {
      list-style: none;
    }
  `,
  template: `
    <dh-result [query]="conversationsQuery()">
      <vater-grid
        gap="dividers"
        autoRows="minmax(var(--case-min-row-height), 1fr)"
        *transloco="let t; prefix: 'meteringPoint.actorConversation'"
      >
        <vater-stack
          sticky="top"
          direction="row"
          justify="space-between"
          align="center"
          offset="m"
          class="new-conversation"
        >
          <h3 watt-heading>{{ t('cases') }}</h3>
          <watt-button
            (click)="createNewConversation.emit()"
            icon="plus"
            variant="text"
            data-testid="new-conversation-button"
          >
            {{ t('newCaseButton') }}
          </watt-button>
        </vater-stack>
        <ul vater fragment class="conversations">
          @if (newConversationVisible()) {
            <li>
              <dh-actor-conversation-list-item
                [conversation]="newConversation"
                [selected]="newConversationVisible()"
              />
            </li>
          }
          @for (conversationItem of conversations(); track conversationItem.id) {
            <li>
              <dh-actor-conversation-list-item
                [conversation]="conversationItem"
                [selected]="selectedConversationId() === conversationItem.id"
                (click)="selectConversation.emit(conversationItem.id)"
              />
            </li>
          }
        </ul>
      </vater-grid>
    </dh-result>
  `,
})
export class DhActorConversationListComponent {
  conversationsQuery = input<QueryResult<GetConversationsQuery, GetConversationsQueryVariables>>();
  conversations = computed(
    () => this.conversationsQuery()?.data()?.conversationsForMeteringPoint?.conversations ?? []
  );
  newConversationVisible = input<boolean>(false);
  selectedConversationId = input<string | undefined>(undefined);
  createNewConversation = output();
  selectConversation = output<string>();

  newConversation: Conversation = {
    __typename: 'ConversationInfo',
    closed: false,
    read: false,
    lastUpdated: dayjs().toDate(),
    id: '',
    displayId: '',
    subject: 'QUESTION_FOR_ENERGINET',
  };
}
