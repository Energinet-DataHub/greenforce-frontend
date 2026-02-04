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
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

import { WATT_CARD } from '@energinet/watt/card';
import { VaterStackComponent } from '@energinet/watt/vater';
import { ConversationMessage } from '../types';

@Component({
  selector: 'dh-actor-conversation-message',
  imports: [WATT_CARD, VaterStackComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      dh-actor-conversation-message {
        display: block;

        watt-card-title h3,
        watt-card-title h4 {
          white-space: wrap;
        }

        watt-card.current-user {
          --bg-card: var(--watt-color-primary-ultralight);
        }
      }
    `,
  ],
  template: `
    <watt-card [variant]="variant()" [class.current-user]="message().isCurrentUser">
      <watt-card-title>
        <vater-stack direction="row" justify="space-between" align="baseline" style="width: 100%">
          <vater-stack gap="xs" align="start" direction="column">
            <span class="watt-text-s" style="font-weight: bold;">{{ message().sender }}</span>
            <span class="watt-text-s">{{ message().senderText }}</span>
          </vater-stack>
          <span class="watt-text-s" style="color: var(--watt-color-neutral-grey-600)">
            {{ message().createdAt | date: 'dd-MM-yyyy HH:mm' }}
          </span>
        </vater-stack>
      </watt-card-title>

      <p class="watt-text-m">{{ message().message }}</p>
    </watt-card>
  `,
})
export class DhActorConversationMessageComponent {
  message = input.required<ConversationMessage>();

  variant = computed(() => (this.message().isCurrentUser ? 'solid' : 'fill'));
}
