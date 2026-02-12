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
import { MessageFormValue } from '../types';
import {
  ActorType,
  ConversationSubject,
  GetConversationsDocument,
  StartConversationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorConversationMessageFormComponent } from './actor-conversation-message-form.component';
import { WattToastService } from '@energinet/watt/toast';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

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
    DhActorConversationMessageFormComponent,
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
      (ngSubmit)="startConversation()"
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
      <dh-actor-conversation-message-form
        vater
        fill="horizontal"
        [loading]="startConversationMutation.loading()"
        [formControl]="newConversationForm.controls.message"
      />
    </form>
  `,
})
export class DhActorConversationNewConversationComponent {
  private readonly toastService = inject(WattToastService);
  private readonly fb = inject(NonNullableFormBuilder);
  startConversationMutation = mutation(StartConversationDocument);
  closeNewConversation = output();

  meteringPointId = input.required<string>();

  newConversationForm = this.fb.group({
    subject: this.fb.control<ConversationSubject>(
      ConversationSubject.QuestionForEnerginet,
      Validators.required
    ),
    receiver: this.fb.control<ActorType>(ActorType.Energinet, Validators.required),
    internalNote: this.fb.control<string | null>(null),
    message: this.fb.control<MessageFormValue>({ content: '', anonymous: false }, (control) =>
      control.value.content ? null : { required: true }
    ),
  });
  subjects = dhEnumToWattDropdownOptions(ConversationSubject);
  receivers = dhEnumToWattDropdownOptions(ActorType);

  async startConversation() {
    if (this.newConversationForm.invalid) {
      return;
    }

    const { subject, receiver, internalNote, message } = this.newConversationForm.getRawValue();

    const { content, anonymous } = message ?? {};

    assertIsDefined(content);
    assertIsDefined(anonymous);

    const result = await this.startConversationMutation.mutate({
      variables: {
        subject: subject,
        meteringPointIdentification: this.meteringPointId(),
        internalNote: internalNote,
        content: content,
        anonymous: anonymous,
        receiver: receiver,
      },
      refetchQueries: [GetConversationsDocument],
    });

    this.closeNewConversation.emit();

    if (result.error) {
      this.toastService.open({
        type: 'danger',
        message: 'Error',
      });
    } else {
      this.toastService.open({
        type: 'success',
        message: content,
      });
    }
  }
}
