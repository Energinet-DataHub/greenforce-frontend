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
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorConversationCaseSubjectType, ActorConversationReceiverType } from '../types';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattIconComponent } from '@energinet/watt/icon';

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
    WattTextFieldComponent,
    WattTextAreaFieldComponent,
    WattIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .third-width {
      width: 33%;
    }
  `,
  template: `
    <form [formGroup]="newCaseForm" (ngSubmit)="send()" vater-flex fill="both">
      <watt-card *transloco="let t; prefix: 'meteringPoint.actorConversation'">
        <vater-flex fill="vertical" justify="space-between">
          <vater-stack fill="horizontal" align="start">
            <watt-card-title>
              <vater-stack direction="row" fill="horizontal" justify="space-between">
                <h3>{{ t('newCaseTitle') }}</h3>
                <watt-button (click)="closeNewCase.emit()" variant="icon" icon="close" />
              </vater-stack>
            </watt-card-title>
            <vater-stack fill="horizontal" align="start" direction="column" gap="m">
              <watt-dropdown
                [formControl]="newCaseForm.controls.subject"
                [options]="subjects"
                [label]="t('subjectLabel')"
                [showResetOption]="false"
                class="third-width"
                dhDropdownTranslator
                translateKey="meteringPoint.actorConversation.subjects"
                data-testid="actor-conversation-subject-dropdown"
              />
              <watt-dropdown
                [formControl]="newCaseForm.controls.receiver"
                [options]="receivers"
                [label]="t('receiverLabel')"
                [showResetOption]="false"
                class="third-width"
                dhDropdownTranslator
                translateKey="meteringPoint.actorConversation.receivers"
                data-testid="actor-conversation-receiver-dropdown"
              />
              <watt-text-field
                [formControl]="newCaseForm.controls.internalNote"
                [label]="t('internalNoteLabel')"
                class="third-width"
                data-testid="actor-conversation-internal-note-input"
              />
            </vater-stack>
          </vater-stack>
          <vater-stack direction="row" align="end" gap="m">
            <watt-textarea-field
              [label]="t('messageLabel')"
              [formControl]="newCaseForm.controls.message"
              data-testid="actor-conversation-message-textarea"
            />
            <watt-button type="submit"
              >{{ t('sendButton') }}
              <watt-icon name="send" />
            </watt-button>
          </vater-stack>
        </vater-flex>
      </watt-card>
    </form>
  `,
})
export class DhActorConversationNewCaseComponent {
  closeNewCase = output();
  createCase = output<string>();

  private readonly fb = inject(NonNullableFormBuilder);

  newCaseForm = this.fb.group({
    subject: this.fb.control<ActorConversationCaseSubjectType>(
      ActorConversationCaseSubjectType.misc,
      Validators.required
    ),
    receiver: this.fb.control<ActorConversationReceiverType>(
      ActorConversationReceiverType.energinet,
      Validators.required
    ),
    internalNote: this.fb.control<string | null>(null),
    message: this.fb.control<string>('', Validators.required),
  });
  subjects = dhEnumToWattDropdownOptions(ActorConversationCaseSubjectType);
  receivers = dhEnumToWattDropdownOptions(ActorConversationReceiverType);

  protected send() {
    if (this.newCaseForm.invalid) {
      return;
    }
    this.createCase.emit(this.newCaseForm.controls.message.value);
  }
}
