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
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';

@Component({
  selector: 'dh-market-participant-conversation-new-case',
  imports: [
    WATT_CARD,
    TranslocoDirective,
    VaterStackComponent,
    WattButtonComponent,
    VaterFlexComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vater-flex fill="both">
      <watt-card *transloco="let t; prefix: 'meteringPoint.marketParticipantConversation'">
        <watt-card-title>
          <vater-stack direction="row" justify="space-between">
            <h3>{{ t('newCaseTitle') }}</h3>
            <watt-button (click)="closeNewCase.emit()" variant="icon" icon="close" />
          </vater-stack>
        </watt-card-title>
      </watt-card>
    </vater-flex>
  `,
})
export class DhMarketParticipantConversationNewCaseComponent {
  closeNewCase = output();
}
