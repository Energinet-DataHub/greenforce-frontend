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
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDatePipe } from '@energinet/watt/date';
import { ConversationMessage } from '@energinet-datahub/dh/shared/domain/graphql';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-actor-conversation-message',
  imports: [VaterStackComponent, WattDatePipe, TranslocoDirective, VaterUtilityDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .message-container {
      border-radius: var(--watt-radius-m);
      border: 1px solid var(--watt-color-neutral-grey-300);
    }

    .no-margin {
      margin: 0;
    }
  `,
  host: {
    class: 'watt-space-inset-m',
    '[style.align-self]': 'messageAlignment()',
    '[style.max-width]': '"66%"',
  },
  template: `
    <vater-stack
      class="message-container"
      [style.background-color]="backgroundColor()"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <vater-stack fill="horizontal" align="start" class="watt-space-inset-m">
        <vater-stack direction="row" justify="space-between" fill="horizontal">
          <span>{{ t('receivers.' + message().senderType) }}</span>
          <span>{{ message().createdTime | wattDate: 'short' }}</span>
        </vater-stack>
        <span>{{ message().actorName + ', ' + message().userName }}</span>
      </vater-stack>
      <hr class="watt-divider no-margin" />
      <span vater fill="horizontal" class="watt-space-inset-m">{{ message().content }}</span>
    </vater-stack>
  `,
})
export class DhActorConversationMessageComponent {
  message = input.required<ConversationMessage>();
  isFromCurrentUser = input(false);
  messageAlignment = computed(() => (this.isFromCurrentUser() ? 'end' : 'start'));
  backgroundColor = computed(() =>
    this.isFromCurrentUser()
      ? 'var(--watt-color-primary-ultralight)'
      : 'var(--watt-color-neutral-grey-100)'
  );
}
