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
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterFlexComponent, VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhActorConversationListItemComponent } from './actor-conversation-list-item';
import { ActorConversationCaseSubjectType, Case } from '../types';

@Component({
  selector: 'dh-actor-conversation-case-list',
  imports: [
    WATT_CARD,
    WattButtonComponent,
    VaterStackComponent,
    TranslocoDirective,
    VaterFlexComponent,
    DhActorConversationListItemComponent,
    VaterUtilityDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .no-padding {
      padding: 0;
    }

    .no-right-border-radius {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0 !important;
    }

    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <vater-flex fill="vertical">
      <watt-card class="no-padding no-right-border-radius" *transloco="let t; prefix: 'meteringPoint.actorConversation'">
        <watt-card-title vater class="watt-space-inset-m no-margin">
          <vater-stack direction="row" justify="space-between" align="center">
            <h3>{{ t('cases') }}</h3>
            <watt-button
              (click)="createNewCase.emit()"
              icon="plus"
              variant="text"
              data-testid="new-case-button"
            >{{ t('newCaseButton') }}
            </watt-button>
          </vater-stack>
        </watt-card-title>
        <hr class="watt-divider no-margin" />
        @if (newCaseVisible()) {
          <dh-actor-conversation-list-item [case]="newCase" [selected]="newCaseVisible()" />
        }
        @for (caseItem of cases(); track caseItem.id) {
          <dh-actor-conversation-list-item
            [case]="caseItem"
            [selected]="selectedCaseId() === caseItem.id"
            (click)="selectCase.emit(caseItem.id)"
          />
        }
      </watt-card>
    </vater-flex>
  `,
})
export class DhActorConversationCaseListComponent {
  cases = input<Case[]>([]);
  newCaseVisible = input<boolean>(false);
  selectedCaseId = input<string | undefined>(undefined);
  createNewCase = output();
  selectCase = output<string | undefined>();

  newCase: Case = {
    closed: false,
    lastUpdatedDate: undefined,
    id: undefined,
    subject: ActorConversationCaseSubjectType.newCase,
  }
}
