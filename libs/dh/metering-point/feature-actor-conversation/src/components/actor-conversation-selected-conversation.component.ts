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
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
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
import { MessageFormValue } from '../types';
import { JsonPipe } from '@angular/common';
import { DhActorConversationMessageFormComponent } from './actor-conversation-message-form.component';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  CloseConversationDocument,
  GetConversationDocument,
  SendActorConversationMessageDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent, injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { DhActorStorage } from 'libs/dh/shared/feature-authorization/src/lib/dh-actor-storage';
import { MsalService } from '@azure/msal-angular';

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
    DhResultComponent,
  ],
  styles: `
    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <dh-result vater fill="vertical" [query]="conversationQuery">
      <vater-stack fill="both" *transloco="let t; prefix: 'meteringPoint.actorConversation'">
        @if (conversation(); as conversation) {
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
                <h3 class="no-margin">{{ t('subjects.' + conversation.subject) }}</h3>
                @if (conversation.closed) {
                  <watt-badge type="neutral">{{ t('closed') }}</watt-badge>
                }
              </vater-stack>
              <vater-stack direction="row" gap="m">
                <vater-stack direction="row" gap="xs">
                  <label>ID</label>
                  <span class="watt-text-s">{{ conversation.id }}</span>
                </vater-stack>
                <vater-stack direction="row" gap="xs">
                  <label>{{ t('internalNoteLabel') }}</label>
                  <span class="watt-text-s">{{ conversation.internalNote }}</span>
                </vater-stack>
              </vater-stack>
            </vater-stack>

            <vater-stack direction="row" gap="m">
              <watt-button
                [disabled]="conversation.closed"
                (click)="closeConversation()"
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
            @for (message of conversation.messages; track message) {
              <span>{{ message | json }}</span>
            }
          </vater-flex>
        }
        <form vater class="watt-space-inset-stretch-m" fill="horizontal" (ngSubmit)="sendMessage()">
          <dh-actor-conversation-message-form
            [loading]="sendActorConversationMessageMutation.loading()"
            [small]="true"
            [formControl]="formControl"
          />
        </form>
      </vater-stack>
    </dh-result>
  `,
})
export class DhActorConversationSelectedConversationComponent {
  private readonly authService = inject(MsalService);
  private readonly actorStorage = inject(DhActorStorage);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly closeConversationMutation = mutation(CloseConversationDocument);
  private readonly closeToast = injectToast(
    'meteringPoint.actorConversation.conversationCloseError'
  );
  private readonly closeToastEffect = effect(() =>
    this.closeToast(this.closeConversationMutation.status())
  );
  sendActorConversationMessageMutation = mutation(SendActorConversationMessageDocument);
  formControl = this.fb.control<MessageFormValue>({ content: '', anonymous: false });
  conversationId = input.required<string>();
  meteringPointId = input.required<string>();

  conversationQuery = query(GetConversationDocument, () => ({
    variables: {
      conversationId: this.conversationId(),
      meteringPointId: this.meteringPointId(),
    },
  }));

  conversation = computed(() => this.conversationQuery.data()?.conversation);

  async closeConversation() {
    await this.closeConversationMutation.mutate({
      variables: {
        conversationId: this.conversationId(),
      },
      refetchQueries: [GetConversationDocument],
    });
  }

  async sendMessage() {
    const token = this.authService.instance.getActiveAccount();
    const userId = token?.idTokenClaims?.sub;

    if (!userId) return;

    const { content, anonymous } = this.formControl.getRawValue();

    if (!content) return;
    await this.sendActorConversationMessageMutation.mutate({
      variables: {
        conversationId: this.conversationId(),
        meteringPointIdentification: this.meteringPointId(),
        actorId: this.actorStorage.getSelectedActorId(),
        anonymous: anonymous ?? false,
        content: content,
        userId,
      },
      refetchQueries: [GetConversationDocument],
    });

    this.formControl.reset({ content: '', anonymous: false });
  }
}
