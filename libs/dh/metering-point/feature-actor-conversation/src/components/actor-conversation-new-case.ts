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
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { WATT_CARD } from '@energinet/watt/card';
import { TranslocoDirective } from '@jsverse/transloco';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';

@Component({
  selector: 'dh-actor-conversation-new-case',
  imports: [WATT_CARD, TranslocoDirective, VaterStackComponent, WattButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: flex; flex-direction: column;',
  },
  styles: `
    .new-case-card {
      flex: 1;
      padding: var(--watt-space-ml);
    }

    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <watt-card class="new-case-card" *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      <vater-stack direction="row" justify="space-between">
        <h2 class="no-margin">{{ t('newCaseTitle') }}</h2>
        <watt-button (click)="closeNewCase.emit()" variant="icon" icon="close" />
      </vater-stack>
    </watt-card>
  `,
})
export class DhActorConversationNewCaseComponent {
  closeNewCase = output();
}
