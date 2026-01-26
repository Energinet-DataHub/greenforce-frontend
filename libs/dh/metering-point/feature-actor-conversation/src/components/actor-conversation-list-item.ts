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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Case } from '../types';
import { VaterStackComponent } from '@energinet/watt/vater';

@Component({
  selector: 'dh-actor-conversation-list-item',
  imports: [VaterStackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vater-stack direction="column" align="start">
      <div class=""></div>
      <vater-stack>
        <span>{{ case().subject }}</span>
        <span>{{ case().id }}</span>
      </vater-stack>
      <vater-stack>
        <span>{{ case().closed }}</span>
        <span>{{case().lastUpdatedDate}}</span>
      </vater-stack>
    </vater-stack>
  `,
})
export class DhActorConversationListItemComponent {
  case = input.required<Case>();
  selectedCaseId = input<string>();
}
