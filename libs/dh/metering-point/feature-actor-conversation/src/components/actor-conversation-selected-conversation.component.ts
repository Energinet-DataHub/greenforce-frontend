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
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { WattIconComponent } from '@energinet/watt/icon';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattButtonComponent } from '@energinet/watt/button';
import {
  WattMenuComponent,
  WattMenuItemComponent,
  WattMenuTriggerDirective,
} from '@energinet/watt/menu';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MessageFormValue, ConversationDetail } from '../types';
import { JsonPipe } from '@angular/common';
import { DhActorConversationMessageFormComponent } from './actor-conversation-message-form.component';

@Component({
  selector: 'dh-actor-conversation-selected-conversation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WattIconComponent,
    VaterStackComponent,
    WattBadgeComponent,
    WattButtonComponent,
    WattMenuComponent,
    WattMenuItemComponent,
    WattMenuTriggerDirective,
    VaterUtilityDirective,
    VaterFlexComponent,
    TranslocoDirective,
    JsonPipe,
    ReactiveFormsModule,
    DhActorConversationMessageFormComponent,
    FormsModule,
  ],
  styles: `
    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <vater-stack fill="both" *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      <!-- Header -->
      <vater-stack
        direction="row"
        fill="horizontal"
        justify="space-between"
        class="watt-space-inset-stretch-m"
      >
        <vater-stack gap="s" align="start">
          <vater-stack direction="row" gap="xs">
            <span class="watt-text-s">Sort Strøm(MOCK)</span>
            <watt-icon name="right" size="xs" />
            <span class="watt-text-s">Netvirksomhed(MOCK)</span>
          </vater-stack>
          <vater-stack direction="row" gap="s">
            <h3 class="no-margin">{{ t('subjects.' + conversation().subject) }}</h3>
            @if (conversation().closed) {
              <watt-badge type="neutral">{{ t('closed') }}</watt-badge>
            }
          </vater-stack>
          <vater-stack direction="row" gap="m">
            <vater-stack direction="row" gap="xs">
              <label>ID</label>
              <span class="watt-text-s">{{ conversation().id }}</span>
            </vater-stack>
            <vater-stack direction="row" gap="xs">
              <label>{{ t('internalNoteLabel') }}</label>
              <span class="watt-text-s">{{ conversation().internalNote }}</span>
            </vater-stack>
          </vater-stack>
        </vater-stack>

        <vater-stack direction="row" gap="m">
          <watt-button
            [disabled]="conversation().closed"
            (click)="closeConversation.emit(conversation().id)"
            variant="secondary"
            >{{ t('closeCaseButton') }}
          </watt-button>
          <watt-button variant="secondary" [wattMenuTriggerFor]="menu">
            <watt-icon name="moreVertical" />
          </watt-button>
          <watt-menu #menu>
            <watt-menu-item>{{ t('internalNoteLabel') }}</watt-menu-item>
            <watt-menu-item>{{ t('markAsUnreadButton') }}</watt-menu-item>
          </watt-menu>
        </vater-stack>
      </vater-stack>
      <hr class="watt-divider no-margin" />

      <!-- Content -->
      <vater-flex fill="both">
        <!-- Messages will go here -->
        @for (message of conversation().messages; track message) {
          <span>{{ message | json }}</span>
        }
      </vater-flex>
      <form
        vater-stack
        fill="horizontal"
        class="watt-space-inset-ml"
        (ngSubmit)="sendMessage.emit(formControl.value)"
      >
        <dh-actor-conversation-message-form
          vater
          fill="horizontal"
          [small]="true"
          [formControl]="formControl"
        />
      </form>
    </vater-stack>
  `,
})
export class DhActorConversationSelectedConversationComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  formControl = this.fb.control<MessageFormValue>({ content: '', anonymous: false });
  conversation = input.required<ConversationDetail>();
  closeConversation = output<string>();
  sendMessage = output<MessageFormValue>();
}
