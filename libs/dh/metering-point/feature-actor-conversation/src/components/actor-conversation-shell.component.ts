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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DhActorConversationCaseListComponent } from './actor-conversation-case-list';
import { DhActorConversationNewCaseComponent } from './actor-conversation-new-case';
import { VaterFlexComponent } from '@energinet/watt/vater';
import { WattToastService } from '@energinet/watt/toast';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { CreateConversationDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-actor-conversation-shell',
  imports: [
    DhActorConversationCaseListComponent,
    DhActorConversationNewCaseComponent,
    VaterFlexComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .flex-1 {
      flex: 1;
    }

    .flex-3 {
      flex: 3;
    }
  `,
  template: `
    <vater-flex direction="row" fill="vertical" gap="m">
      <dh-actor-conversation-case-list (createNewCase)="newCaseVisible.set(true)" class="flex-1" />
      @if (newCaseVisible()) {
        <dh-actor-conversation-new-case
          (closeNewCase)="newCaseVisible.set(false)"
          (createCase)="send($event)"
          class="flex-3"
        />
      } @else {
        <div class="flex-3"></div>
      }
    </vater-flex>
  `,
})
export class DhActorConversationShellComponent {
  newCaseVisible = signal(false);
  private toastService = inject(WattToastService);
  createConversationMutation = mutation(CreateConversationDocument);

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
}
