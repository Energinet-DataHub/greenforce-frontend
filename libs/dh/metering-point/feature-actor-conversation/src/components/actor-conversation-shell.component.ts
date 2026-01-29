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
import { DhActorConversationCaseListComponent } from './actor-conversation-case-list';
import { DhActorConversationNewCaseComponent } from './actor-conversation-new-case';
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
import { ActorConversationCaseSubjectType, ActorConversationState } from '../types';
import { WattButtonComponent } from '@energinet/watt/button';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-actor-conversation-shell',
  imports: [
    DhActorConversationCaseListComponent,
    DhActorConversationNewCaseComponent,
    VaterFlexComponent,
    WattEmptyStateComponent,
    WATT_CARD,
    WattButtonComponent,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .no-border-radius-left {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
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
      <dh-actor-conversation-case-list
        [cases]="cases()"
        [newCaseVisible]="newCaseVisible()"
        [selectedCaseId]="selectedCaseId()"
        (createNewCase)="newCase()"
        (selectCase)="selectCase($event)"
        class="flex-1"
      />
      <watt-card class="flex-3 no-border-radius-left">
        <vater-stack fill="vertical">
          @switch (state()) {
            @case (ActorConversationState.newCaseOpen) {
              <dh-actor-conversation-new-case
                vater
                fill="both"
                (closeNewCase)="newCaseVisible.set(false)"
                (createCase)="send($event)"
              />
            }
            @case (ActorConversationState.noCases) {
              <watt-empty-state
                vater
                center
                icon="custom-cooperation"
                [title]="t('emptyState.noCases')"
              >
                <watt-button variant="secondary" (click)="newCaseVisible.set(true)">
                  {{ t('newCaseButton') }}
                </watt-button>
              </watt-empty-state>
            }
            @case (ActorConversationState.noCaseSelected) {
              <watt-empty-state
                vater
                center
                icon="custom-cooperation"
                [title]="t('emptyState.noCaseSelected')"
              />
            }
            @case (ActorConversationState.caseSelected) {
              <h1>TO BE IMPLEMENTED</h1>
            }
          }
        </vater-stack>
      </watt-card>
    </vater-flex>
  `,
})
export class DhActorConversationShellComponent {
  protected readonly ActorConversationState = ActorConversationState;
  newCaseVisible = signal(false);
  cases = signal([
    {
      id: '00001',
      subject: ActorConversationCaseSubjectType.misc,
      lastUpdatedDate: new Date(),
      closed: false,
      unread: true,
    },
    {
      id: '00002',
      subject: ActorConversationCaseSubjectType.customerMasterData,
      lastUpdatedDate: new Date(),
      closed: true,
    },
  ]);
  selectedCaseId = signal<string | undefined>(undefined);
  state = computed<ActorConversationState>(() => {
    if (this.newCaseVisible()) {
      return ActorConversationState.newCaseOpen;
    } else if (this.cases().length === 0) {
      return ActorConversationState.noCases;
    } else if (this.selectedCaseId() === undefined) {
      return ActorConversationState.noCaseSelected;
    }
    return ActorConversationState.caseSelected;
  });
  createConversationMutation = mutation(CreateConversationDocument);
  private toastService = inject(WattToastService);

  async send(message: string) {
    const result = await this.createConversationMutation.mutate({
      variables: {
        meteringPointIdentification: '571313000000000000',
        conversationMessageContent: message,
      },
    });
    this.newCaseVisible.set(false);
    if (result.error) {
      this.toastService.open({
        type: 'danger',
        message: 'Error',
      });
    } else {
      this.toastService.open({
        type: 'success',
        message: message,
      });
    }
  }

  newCase() {
    this.newCaseVisible.set(true);
    this.selectedCaseId.set(undefined);
  }

  selectCase(caseId?: string): void {
    this.newCaseVisible.set(false);
    this.selectedCaseId.set(caseId);
  }
}
