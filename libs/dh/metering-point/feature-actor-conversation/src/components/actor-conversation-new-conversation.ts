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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { VATER, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhFormControlToSignal,
  dhMakeFormControl,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { internalNoteMaxLength, MessageFormValue, messageMaxLength } from '../types';
import {
  ActorType,
  ConversationSubject,
  GetConversationsDocument,
  StartConversationDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorConversationMessageFormComponent } from './actor-conversation-message-form.component';
import { DhActorConversationReceiverRadioGroupComponent } from './actor-conversation-receiver-radio-group';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhActorConversationElectricalHeatingFormComponent
} from './actor-conversation-electrical-heating-form.component';

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
    WattSlideToggleComponent,
    DhActorConversationReceiverRadioGroupComponent,
    DhActorConversationElectricalHeatingFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .header-background {
      background-color: var(--bg-card);
    }
  `,
  template: `
    <form
      [formGroup]="newConversationForm()"
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
        <watt-button (click)="closeNewConversation.emit()" variant="secondary">
          {{ t('cancelButtonLabel') }}
        </watt-button>
      </vater-stack>
      <vater-grid columns="1fr 2fr" rows="auto 1fr" offset="m" gap="m">
        <vater-grid-area column="1" row="1">
          <vater-stack direction="column" gap="m" align="start">
            <watt-dropdown
              [formControl]="newConversationForm().controls.subject"
              [options]="subjects"
              [label]="t('subjectLabel')"
              [showResetOption]="false"
              dhDropdownTranslator
              translateKey="meteringPoint.actorConversation.subjects"
              data-testid="actor-conversation-subject-dropdown"
            />
            @if (isElectricalHeating()) {
              <watt-slide-toggle>
                {{ t('reducedElectricityTaxToggle') }}
              </watt-slide-toggle>
            }
            <vater-flex fill="horizontal" direction="row" gap="m" align="start">
              <dh-actor-conversation-receiver-radio-group
                [marketRole]="currentActorMarketRole"
                [receiverControl]="newConversationForm().controls.receiver"
                [dateControl]="newConversationForm().controls.energySupplierDate"
              />
            </vater-flex>
            <watt-text-field
              [formControl]="newConversationForm().controls.internalNote"
              [label]="t('internalNoteLabelWithDisclaimer')"
              data-testid="actor-conversation-internal-note-input"
            />
          </vater-stack>
        </vater-grid-area>
        <vater-grid-area column="1 / span 2" row="2" fill="horizontal">
          <vater-stack fill="vertical" justify="end">
            <dh-actor-conversation-message-form
              vater
              fill="horizontal"
              [loading]="startConversationMutation.loading()"
              [formControl]="newConversationForm().controls.message"
            />
          </vater-stack>
        </vater-grid-area>
        @if (shouldShowEletricalHeatingForm()) {
          <vater-grid-area column="2" row="1">
            <dh-actor-conversation-electrical-heating-form />
          </vater-grid-area>
        }
      </vater-grid>
    </form>
  `,
})
export class DhActorConversationNewConversationComponent {
  private readonly startConversationErrorToast = injectToast(
    'meteringPoint.actorConversation.startConversationError'
  );
  public readonly currentActorMarketRole = inject(DhActorStorage).getSelectedActor().marketRole;

  startConversationMutation = mutation(StartConversationDocument);
  closeNewConversation = output();
  meteringPointId = input.required<string>();

  subjects = dhEnumToWattDropdownOptions(ConversationSubject);

  newConversationForm = computed(
    () =>
      new FormGroup({
        subject: dhMakeFormControl<ConversationSubject | null>(null, Validators.required),
        receiver: dhMakeFormControl<ActorType | null>(null, Validators.required),
        energySupplierDate: dhMakeFormControl<Date | null>(null),
        internalNote: dhMakeFormControl<string | null>(
          null,
          Validators.maxLength(internalNoteMaxLength)
        ),
        message: dhMakeFormControl<MessageFormValue>({ content: '', anonymous: false }, [
          (control) => (control.value.content ? null : { required: true }),
          Validators.maxLength(messageMaxLength),
        ]),
      })
  );

  private readonly subjectValue = dhFormControlToSignal(
    () => this.newConversationForm().controls.subject
  );

  private readonly receiverValue = dhFormControlToSignal(
    () => this.newConversationForm().controls.receiver
  );

  isElectricalHeating = computed(
    () => this.subjectValue() === ConversationSubject.ElectricalHeating
  );

  private readonly syncEnergySupplierDateValidators = effect(() => {
    const energySupplierDateControl = this.newConversationForm().controls.energySupplierDate;
    if (this.receiverValue() === ActorType.EnergySupplier) {
      energySupplierDateControl.addValidators(Validators.required);
    } else {
      energySupplierDateControl.removeValidators(Validators.required);
      energySupplierDateControl.reset();
    }
    energySupplierDateControl.updateValueAndValidity();
  });

  private readonly reducedElectricityTaxValue = dhFormControlToSignal(
    this.newConversationForm.controls.reducedElectricityTax
  );

  shouldShowEletricalHeatingForm = computed(
    () => this.isElectricalHeating() && this.reducedElectricityTaxValue()
  );

  async startConversation() {
    if (this.newConversationForm().invalid) return;

    const { subject, receiver, internalNote, message } = this.newConversationForm().getRawValue();

    if (!receiver || !subject) return;

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
