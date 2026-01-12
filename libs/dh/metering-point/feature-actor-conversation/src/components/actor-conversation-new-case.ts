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
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { WATT_CARD } from '@energinet/watt/card';
import { TranslocoDirective } from '@jsverse/transloco';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { DhDropdownTranslatorDirective, dhEnumToWattDropdownOptions, } from '@energinet-datahub/dh/shared/ui-util';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorConversationCaseType, ActorConversationReceiverType } from '../types';

@Component({
  selector: 'dh-actor-conversation-new-case',
  imports: [
    WATT_CARD,
    TranslocoDirective,
    VaterStackComponent,
    WattButtonComponent,
    VaterFlexComponent,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .third-width {
      width: 33%;
    }
  `,
  template: `
    <vater-flex fill="both">
      <watt-card *transloco="let t; prefix: 'meteringPoint.actorConversation'">
        <watt-card-title>
          <vater-stack direction="row" justify="space-between">
            <h3>{{ t('newCaseTitle') }}</h3>
            <watt-button (click)="closeNewCase.emit()" variant="icon" icon="close" />
          </vater-stack>
        </watt-card-title>
        <form [formGroup]="newCaseForm" vater-stack gap="l" align="start">
          <watt-dropdown
            [formControl]="newCaseForm.controls.type"
            [options]="types"
            [label]="t('typeLabel')"
            [showResetOption]="false"
            class="third-width"
            dhDropdownTranslator
            translateKey="meteringPoint.actorConversation.types"
          />
          <watt-dropdown
            [formControl]="newCaseForm.controls.receiver"
            [options]="receivers"
            [label]="t('receiverLabel')"
            [showResetOption]="false"
            class="third-width"
            dhDropdownTranslator
            translateKey="meteringPoint.actorConversation.receivers"
          />
        </form>
      </watt-card>
    </vater-flex>
  `,
})
export class DhActorConversationNewCaseComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  newCaseForm = this.fb.group({
    type: this.fb.control<ActorConversationCaseType>(
      ActorConversationCaseType.misc,
      Validators.required
    ),
    receiver: this.fb.control<ActorConversationReceiverType>(
      ActorConversationReceiverType.energinet,
      Validators.required
    ),
  });
  closeNewCase = output();
  types = dhEnumToWattDropdownOptions(ActorConversationCaseType);
  receivers = dhEnumToWattDropdownOptions(ActorConversationReceiverType);
}
