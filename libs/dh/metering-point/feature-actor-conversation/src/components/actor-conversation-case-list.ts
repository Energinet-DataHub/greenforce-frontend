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
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-actor-conversation-case-list',
  imports: [
    WATT_CARD,
    WattButtonComponent,
    VaterStackComponent,
    TranslocoDirective,
    VaterFlexComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vater-flex fill="vertical">
      <watt-card *transloco="let t; prefix: 'meteringPoint.actorConversation'">
        <watt-card-title>
          <vater-stack direction="row" justify="space-between" align="center">
            <h3>{{ t('cases') }}</h3>
            <watt-button (click)="createNewCase.emit()" icon="plus" variant="text" data-testid="new-case-button"
              >{{ t('newCaseButton') }}
            </watt-button>
          </vater-stack>
        </watt-card-title>
        <hr class="watt-divider" />
      </watt-card>
    </vater-flex>
  `,
})
export class DhActorConversationCaseListComponent {
  createNewCase = output();
}
