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
import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhActorConversationListItemComponent } from './actor-conversation-list-item';
import { Conversation } from '../types';
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
    WATT_CARD,
    WattButtonComponent,
    VaterStackComponent,
    TranslocoDirective,
    VaterFlexComponent,
    DhActorConversationListItemComponent,
    VaterUtilityDirective,
    DhResultComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .no-padding {
      padding: 0;
    }

    .no-right-border-radius {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0 !important;
    }

    .no-margin {
      margin: 0;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  `,
  template: `
    <vater-flex fill="vertical">
      <watt-card
        class="no-padding no-right-border-radius"
        *transloco="let t; prefix: 'meteringPoint.actorConversation'"
      >
        <watt-card-title vater class="watt-space-inset-m no-margin">
          <vater-stack direction="row" justify="space-between" align="center">
            <h3>{{ t('cases') }}</h3>
            <watt-button
              (click)="createNewConversation.emit()"
              icon="plus"
              variant="text"
              data-testid="new-conversation-button"
              >{{ t('newCaseButton') }}
            </watt-button>
          </vater-stack>
        </watt-card-title>
        <hr class="watt-divider no-margin" />
        <dh-result vater fill="vertical" [query]="conversationsQuery()">
          <ul>
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
        </dh-result>
      </watt-card>
    </vater-flex>
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
  selectConversation = output<string | undefined>();

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
