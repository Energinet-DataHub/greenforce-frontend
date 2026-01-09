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
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DhMarketParticipantConversationCaseListComponent } from './market-participant-conversation-case-list';
import { DhMarketParticipantConversationNewCaseComponent } from './market-participant-conversation-new-case';
import { VaterFlexComponent } from '@energinet/watt/vater';

@Component({
  selector: 'dh-market-participant-conversation-shell',
  imports: [
    DhMarketParticipantConversationCaseListComponent,
    DhMarketParticipantConversationNewCaseComponent,
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
    <vater-flex direction="row" fill="vertical" gap="m" class="watt-space-inset-m">
      <dh-market-participant-conversation-case-list
        (createNewCase)="newCaseVisible.set(true)"
        class="flex-1"
      />
      @if (newCaseVisible()) {
        <dh-market-participant-conversation-new-case
          (closeNewCase)="newCaseVisible.set(false)"
          class="flex-3"
        />
      } @else {
        <div class="flex-3"></div>
      }
    </vater-flex>
  `,
})
export class DhMarketParticipantConversationShellComponent {
  newCaseVisible = signal(false);
}
