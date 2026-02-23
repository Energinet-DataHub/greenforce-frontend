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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattButtonComponent } from '@energinet/watt/button';
import { VATER, VaterUtilityDirective } from '@energinet/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhActorConversationListItemComponent } from './actor-conversation-list-item';
import { Conversation, NewConversation } from '../types';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { QueryResult } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetConversationsQuery,
  GetConversationsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { dayjs } from '@energinet/watt/core/date';
import { WattSimpleSearchComponent } from '@energinet/watt/search';
import { WattIconComponent } from '@energinet/watt/icon';

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
    ReactiveFormsModule,
    WattSimpleSearchComponent,
    WattIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .new-conversation {
      background-color: var(--bg-card);
    }

    .conversations {
      list-style: none;
    }

    .thick-divider {
      border-top: 2px solid var(--watt-color-neutral-grey-300);
      margin: 0;
    }
  `,
  template: `
    <vater-stack sticky="top" *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      <vater-stack fill="horizontal" class="new-conversation watt-space-inset-m" gap="m">
        <vater-stack fill="horizontal" direction="row" justify="space-between" align="center">
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
        <vater-stack fill="horizontal" direction="row" gap="s">
          <watt-simple-search
            vater
            fill="horizontal"
            [label]="t('searchPlaceholder')"
            [formControl]="searchControl"
            (search)="filter.emit($event)"
          />
          <watt-button variant="secondary">
            <watt-icon name="filter" />
          </watt-button>
        </vater-stack>
      </vater-stack>
      <hr class="watt-divider thick-divider" />
    </vater-stack>

    <dh-result [query]="conversationsQuery()">
      <vater-grid gap="dividers" autoRows="minmax(var(--case-min-row-height), 1fr)">
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
                (click)="selectConversation.emit(conversationItem)"
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
  filter = output<string>();
  selectConversation = output<Conversation>();
  searchControl = new FormControl('');

  newConversation: NewConversation = {
    __typename: 'ConversationInfo',
    closed: false,
    read: true,
    lastUpdated: dayjs().toDate(),
    id: '',
    displayId: '',
    subject: 'newCase',
  };
}
