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
import { TranslocoDirective, translateObjectSignal } from '@jsverse/transloco';
import { DhActorConversationListItemComponent } from './actor-conversation-list-item';
import { Conversation, NewConversation } from '../types';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { QueryResult } from '@energinet-datahub/dh/shared/util-apollo';
import { WattSeparatorComponent } from '@energinet/watt/separator';
import {
  ConversationSubject,
  GetConversationsQuery,
  GetConversationsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhEnumToWattDropdownOptions,
  DhResultComponent,
} from '@energinet-datahub/dh/shared/ui-util';
import { dayjs } from '@energinet/watt/core/date';
import { WattSimpleSearchComponent } from '@energinet/watt/search';
import { WattDropdownComponent, WattDropdownOptionGroup } from '@energinet/watt/dropdown';

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
    WattDropdownComponent,
    WattSeparatorComponent,
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
    <vater-stack sticky="top" *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      <vater-stack
        fill="horizontal"
        class="new-conversation watt-space-inset-ml"
        gap="m"
        align="start"
      >
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
        <watt-simple-search
          vater
          fill="horizontal"
          [label]="t('searchPlaceholder')"
          [formControl]="searchControl"
          (search)="filter.emit($event)"
        />
        <watt-dropdown
          [formControl]="formControl"
          [options]="options()"
          [multiple]="true"
          [chipMode]="true"
          [placeholder]="t('filters.placeholder')"
        />
      </vater-stack>
      <watt-separator size="m" />
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
  private readonly translations = translateObjectSignal('meteringPoint.actorConversation');

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
  formControl = new FormControl<string | ''>('');
  conversationSubjectOptions = dhEnumToWattDropdownOptions(ConversationSubject);

  options = computed<WattDropdownOptionGroup[]>(() => {
    const t = this.translations();

    return [
      {
        label: t['filters']['general'],
        options: [
          { value: 'myCases', displayValue: t['filters']['myCases'] },
          { value: 'showOnlyUnread', displayValue: t['filters']['showOnlyUnread'] },
        ],
      },
      {
        label: t['filters']['status'],
        options: [
          { value: 'active', displayValue: t['active'] },
          { value: 'closed', displayValue: t['closed'] },
        ],
      },
      {
        label: t['subjectLabel'],
        options: this.conversationSubjectOptions.map((option) => ({
          ...option,
          displayValue: t['subjects'][option.value],
        })),
      },
    ];
  });

  newConversation: NewConversation = {
    __typename: 'ConversationInfo',
    closed: false,
    read: true,
    lastUpdated: undefined,
    id: '',
    displayId: '',
    subject: 'newCase',
  };
}
