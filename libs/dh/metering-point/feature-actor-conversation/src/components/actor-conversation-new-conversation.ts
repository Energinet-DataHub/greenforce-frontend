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
import { TranslocoDirective } from '@jsverse/transloco';
import {
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DhActorConversationTextAreaComponent } from './actor-conversation-text-area.component';
import { StartConversationFormValue } from '../types';
import { ActorType, ConversationSubject } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-actor-conversation-new-conversation',
  imports: [
    TranslocoDirective,
    VaterStackComponent,
    WattButtonComponent,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
    ReactiveFormsModule,
    WattTextFieldComponent,
    VaterUtilityDirective,
    VaterSpacerComponent,
    DhActorConversationTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .third-width {
      width: 33%;
    }
  `,
  template: `
    <form
      [formGroup]="newConversationForm"
      (ngSubmit)="send()"
      vater-stack
      fill="both"
      align="start"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <watt-card-title vater fill="horizontal">
        <vater-stack direction="row" fill="horizontal" justify="space-between">
          <h3>{{ t('newCaseTitle') }}</h3>
          <watt-button (click)="closeNewConversation.emit()" variant="icon" icon="close" />
        </vater-stack>
      </watt-card-title>
      <vater-stack align="start" fill="horizontal" gap="ml" offset="m">
        <watt-dropdown
          [formControl]="newConversationForm.controls.subject"
          [options]="subjects"
          [label]="t('subjectLabel')"
          [showResetOption]="false"
          class="third-width"
          dhDropdownTranslator
          translateKey="meteringPoint.actorConversation.subjects"
          data-testid="actor-conversation-subject-dropdown"
        />
        <watt-dropdown
          [formControl]="newConversationForm.controls.receiver"
          [options]="receivers"
          [label]="t('receiverLabel')"
          [showResetOption]="false"
          class="third-width"
          dhDropdownTranslator
          translateKey="meteringPoint.actorConversation.receivers"
          data-testid="actor-conversation-receiver-dropdown"
        />
        <watt-text-field
          [formControl]="newConversationForm.controls.internalNote"
          [label]="t('internalNoteLabelWithDisclaimer')"
          class="third-width"
          data-testid="actor-conversation-internal-note-input"
        />
      </vater-stack>
      <vater-spacer />
      <dh-actor-conversation-text-area
        vater
        fill="horizontal"
        [formControl]="newConversationForm.controls.message"
      />
    </form>
  `,
})
export class DhActorConversationNewConversationComponent {
  closeNewConversation = output();
  startConversation = output<StartConversationFormValue>();

  private readonly fb = inject(NonNullableFormBuilder);

  newConversationForm = this.fb.group({
    subject: this.fb.control<ConversationSubject>(
      ConversationSubject.QuestionForEnerginet,
      Validators.required
    ),
    receiver: this.fb.control<ActorType>(ActorType.Energinet, Validators.required),
    internalNote: this.fb.control<string | null>(null),
    message: this.fb.control<string>('', Validators.required),
  });
  subjects = dhEnumToWattDropdownOptions(ConversationSubject);
  receivers = dhEnumToWattDropdownOptions(ActorType);

  protected send() {
    if (this.newConversationForm.invalid) {
      return;
    }

    const formControls = this.newConversationForm.controls;
    const formValues: StartConversationFormValue = {
      subject: formControls.subject.value,
      content: formControls.message.value,
      anonymous: false,
      receiver: formControls.receiver.value,
      internalNote: formControls.internalNote.value ?? undefined,
    };
    this.startConversation.emit(formValues);
  }
}
