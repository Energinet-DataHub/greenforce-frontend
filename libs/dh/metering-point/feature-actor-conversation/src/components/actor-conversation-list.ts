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
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WattButtonComponent } from '@energinet/watt/button';
import { VATER } from '@energinet/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhActorConversationListItemComponent } from './actor-conversation-list-item';
import { Conversation } from '../types';

@Component({
  selector: 'dh-actor-conversation-list',
  imports: [TranslocoDirective, VATER, WattButtonComponent, DhActorConversationListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .cases {
      list-style: none;
    }
  `,
  template: `
    <vater-grid
      gap="dividers"
      autoRows="1fr"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <vater-stack
        [style.backgroundColor]="'var(--bg-card)'"
        sticky="top"
        direction="row"
        justify="space-between"
        align="center"
        offset="ml"
      >
        <h3>{{ t('cases') }}</h3>
        <watt-button
          (click)="createNewConversation.emit()"
          icon="plus"
          variant="text"
          data-testid="new-conversation-button"
        >
          {{ t('newCaseButton') }}
        </watt-button>
      </vater-stack>
      <ul vater fragment class="cases">
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
  `,
})
export class DhActorConversationListComponent {
  conversations = input<Conversation[]>([]);
  newConversationVisible = input<boolean>(false);
  selectedConversationId = input<string | undefined>(undefined);
  createNewConversation = output();
  selectConversation = output<string | undefined>();

  newConversation: Conversation = {
    closed: false,
    lastUpdatedDate: undefined,
    id: undefined,
    subject: 'newCase',
  };
}
