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
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { VATER, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { internalNoteMaxLength, MessageFormValue, messageMaxLength } from '../types';
import {
  ActorType,
  ConversationSubject,
  GetConversationsDocument,
  StartConversationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorConversationMessageFormComponent } from './actor-conversation-message-form.component';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

@Component({
  selector: 'dh-actor-conversation-new-conversation',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WattButtonComponent,
    WattDropdownComponent,
    WattHeadingComponent,
    WattTextFieldComponent,
    DhDropdownTranslatorDirective,
    VaterUtilityDirective,
    DhActorConversationMessageFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .header-background {
      background-color: var(--bg-card);
    }
  `,
  template: `
    <form
      [formGroup]="newConversationForm"
      (ngSubmit)="startConversation()"
      vater-grid
      fill="vertical"
      rows="minmax(var(--case-min-row-height), auto) 1fr"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <vater-stack
        sticky="top"
        direction="row"
        fill="horizontal"
        align="center"
        offset="m"
        justify="space-between"
        class="header-background"
      >
        <h3 watt-heading>{{ t('newCaseTitle') }}</h3>
        <watt-button (click)="closeNewConversation.emit()" variant="icon" icon="close" />
      </vater-stack>
      <vater-grid columns="1fr 2fr" flow="column" offset="m" gap="m" justify="end">
        <watt-dropdown
          [formControl]="newConversationForm.controls.subject"
          [options]="subjects"
          [label]="t('subjectLabel')"
          [showResetOption]="false"
          dhDropdownTranslator
          translateKey="meteringPoint.actorConversation.subjects"
          data-testid="actor-conversation-subject-dropdown"
        />
        <watt-dropdown
          [formControl]="newConversationForm.controls.receiver"
          [options]="receivers"
          [label]="t('receiverLabel')"
          [showResetOption]="false"
          dhDropdownTranslator
          translateKey="meteringPoint.actorConversation.receivers"
          data-testid="actor-conversation-receiver-dropdown"
        />
        <watt-text-field
          [formControl]="newConversationForm.controls.internalNote"
          [label]="t('internalNoteLabelWithDisclaimer')"
          data-testid="actor-conversation-internal-note-input"
        />
        <vater-grid-area row="4" fill="horizontal">
          <vater-stack fill="vertical" justify="end">
            <dh-actor-conversation-message-form
              vater
              fill="horizontal"
              [loading]="startConversationMutation.loading()"
              [formControl]="newConversationForm.controls.message"
            />
          </vater-stack>
        </vater-grid-area>
      </vater-grid>
    </form>
  `,
})
export class DhActorConversationNewConversationComponent {
  private readonly startConversationErrorToast = injectToast(
    'meteringPoint.actorConversation.startConversationError'
  );
  private readonly fb = inject(NonNullableFormBuilder);
  startConversationMutation = mutation(StartConversationDocument);
  closeNewConversation = output();

  meteringPointId = input.required<string>();

  newConversationForm = this.fb.group({
    subject: this.fb.control<ConversationSubject | null>(null, Validators.required),
    receiver: this.fb.control<ActorType | null>(null, Validators.required),
    internalNote: this.fb.control<string | null>(null, Validators.maxLength(internalNoteMaxLength)),
    message: this.fb.control<MessageFormValue>({ content: '', anonymous: false }, [
      (control) => (control.value.content ? null : { required: true }),
      Validators.maxLength(messageMaxLength),
    ]),
  });
  subjects = dhEnumToWattDropdownOptions(ConversationSubject);
  receivers = dhEnumToWattDropdownOptions(ActorType);

  async startConversation() {
    if (this.newConversationForm.invalid) {
      return;
    }

    const { subject, receiver, internalNote, message } = this.newConversationForm.getRawValue();

    if (!receiver || !subject) {
      return;
    }

    const { content, anonymous } = message ?? {};

    assertIsDefined(content);
    assertIsDefined(anonymous);

    await this.startConversationMutation.mutate({
      variables: {
        meteringPointIdentification: this.meteringPointId(),
        subject,
        internalNote,
        content,
        anonymous,
        receiver,
      },
      refetchQueries: [GetConversationsDocument],
    });

    this.closeNewConversation.emit();
  }
}
