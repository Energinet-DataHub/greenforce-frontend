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
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import { WattToastService } from '@energinet/watt/toast';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { CreateConversationDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';
import { WATT_CARD } from '@energinet/watt/card';
import { ActorConversationConversationSubjectType, ActorConversationState } from '../types';
import { WattButtonComponent } from '@energinet/watt/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhActorConversationListComponent } from './actor-conversation-list';
import { DhActorConversationNewConversationComponent } from './actor-conversation-new-conversation';
import { DhActorConversationSelectedConversationComponent } from './actor-conversation-selected-conversation.component';

@Component({
  selector: 'dh-actor-conversation-shell',
  imports: [
    DhActorConversationListComponent,
    DhActorConversationNewConversationComponent,
    VaterFlexComponent,
    WattEmptyStateComponent,
    WATT_CARD,
    WattButtonComponent,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
    DhActorConversationSelectedConversationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .no-border-radius-left {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .no-padding {
      padding: 0;
    }

    .flex-1 {
      flex: 1;
    }

    .flex-3 {
      flex: 3;
    }
  `,
  template: `
    <vater-flex
      direction="row"
      fill="vertical"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <dh-actor-conversation-list
        [conversations]="conversations()"
        [newConversationVisible]="newConversationVisible()"
        [selectedConversationId]="selectedConversationId()"
        (createNewConversation)="newConversation()"
        (selectConversation)="selectConversation($event)"
        class="flex-1"
      />
      <watt-card class="flex-3 no-padding no-border-radius-left">
        <vater-stack fill="vertical">
          @switch (state()) {
            @case (ActorConversationState.newConversationOpen) {
              <dh-actor-conversation-new-conversation
                vater
                fill="both"
                class="watt-space-inset-m"
                (closeNewConversation)="newConversationVisible.set(false)"
                (createConversation)="send($event)"
              />
            }
            @case (ActorConversationState.noConversations) {
              <watt-empty-state
                vater
                center
                icon="custom-cooperation"
                [title]="t('emptyState.noCases')"
              >
                <watt-button variant="secondary" (click)="newConversationVisible.set(true)">
                  {{ t('newCaseButton') }}
                </watt-button>
              </watt-empty-state>
            }
            @case (ActorConversationState.noConversationSelected) {
              <watt-empty-state
                vater
                center
                icon="custom-cooperation"
                [title]="t('emptyState.noCaseSelected')"
              />
            }
            @case (ActorConversationState.conversationSelected) {
              <dh-actor-conversation-selected-conversation vater fill="both" />
            }
          }
        </vater-stack>
      </watt-card>
    </vater-flex>
  `,
})
export class DhActorConversationShellComponent {
  protected readonly ActorConversationState = ActorConversationState;
  newConversationVisible = signal(false);
  conversations = signal([
    {
      id: '00001',
      subject: ActorConversationConversationSubjectType.misc,
      lastUpdatedDate: new Date(),
      closed: false,
      unread: true,
    },
    {
      id: '00002',
      subject: ActorConversationConversationSubjectType.customerMasterData,
      lastUpdatedDate: new Date(),
      closed: true,
    },
  ]);
  selectedConversationId = signal<string | undefined>(undefined);
  state = computed<ActorConversationState>(() => {
    if (this.newConversationVisible()) {
      return ActorConversationState.newConversationOpen;
    } else if (this.conversations().length === 0) {
      return ActorConversationState.noConversations;
    } else if (this.selectedConversationId() === undefined) {
      return ActorConversationState.noConversationSelected;
    }
    return ActorConversationState.conversationSelected;
  });
  createConversationMutation = mutation(CreateConversationDocument);
  private toastService = inject(WattToastService);

  async createConversation(formValue: StartConversationFormValue) {
    const meteringPointIdentification = '571313131313131313'; // TODO: Get from context
    const actorName = 'Testnet & CO'; // TODO: Get from context
    const userName = 'Test Testesen'; // TODO: Get from context

    const result = await this.startConversationMutation.mutate({
      variables: {
        subject: formValue.subject,
        meteringPointIdentification: meteringPointIdentification,
        actorName: actorName,
        userName: userName,
        internalNote: formValue.internalNote,
        content: formValue.content,
        anonymous: formValue.anonymous,
        receiver: formValue.receiver,
      },
    });
    this.newConversationVisible.set(false);
    if (result.error) {
      this.toastService.open({
        type: 'danger',
        message: 'Error',
      });
    } else {
      this.toastService.open({
        type: 'success',
        message: formValue.content,
      });
    }
  }

  newConversation() {
    this.newConversationVisible.set(true);
    this.selectedConversationId.set(undefined);
  }

  selectConversation(conversationId?: string): void {
    this.newConversationVisible.set(false);
    this.selectedConversationId.set(conversationId);
  }
}
