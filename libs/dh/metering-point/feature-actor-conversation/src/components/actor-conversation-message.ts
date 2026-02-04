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
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattDatePipe } from '@energinet/watt/date';

@Component({
  selector: 'dh-actor-conversation-message',
  imports: [VaterStackComponent, WattDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <vater-stack>
      <vater-stack>
        <vater-stack direction="row" justify="space-between" fill="horizontal">
          <span>Netvirsomhed</span>
          <span>{{ date | wattDate: 'short' }}</span>
        </vater-stack>
        <span>Den Grønne Strøm, Niels Pedersen</span>
      </vater-stack>
      <span>Vi har haft problemer med at hjemtage måledata på dette målepunkt. Vi forsøger igen kl.
        09</span
      >
    </vater-stack>
  `,
})
export class DhActorConversationMessageComponent {
  date = new Date();
}
