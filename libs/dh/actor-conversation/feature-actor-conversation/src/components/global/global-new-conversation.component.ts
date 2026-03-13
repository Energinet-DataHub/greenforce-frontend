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
  output,
  signal,
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
import {
  ElectricalHeatingFormValue,
  internalNoteMaxLength,
  MessageFormValue,
  messageMaxLength,
} from '../../types';
import {
  ConversationSubject,
  GetConversationsDocument,
  GetElectricalHeatingDocument,
  MarketRole,
  StartConversationDocument,
  StartElectricalHeatingConversationInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorConversationMessageFormComponent } from '../actor-conversation-message-form.component';
import { DhActorConversationReceiverRadioGroupComponent } from '../actor-conversation-receiver-radio-group';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { injectUploadMessageDocument } from '../upload-message-document';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhActorConversationElectricalHeatingFormComponent } from '../actor-conversation-electrical-heating-form.component';
import { WattSeparatorComponent } from '@energinet/watt/separator';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';

@Component({
  selector: 'dh-global-new-conversation',
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
    WattSeparatorComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
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
        align="start"
        justify="space-between"
        class="header-background"
      >
        <h3 watt-heading>{{ t('newCaseTitle') }}</h3>
        <watt-button (click)="closeNewConversation.emit(undefined)" variant="secondary">
          {{ t('cancelButtonLabel') }}
        </watt-button>
      </vater-stack>
      <vater-grid columns="1fr 2fr" rows="auto 1fr" gap="m">
        <vater-grid-area column="1" row="1">
          <vater-stack direction="column" gap="m" align="start">
            <watt-text-field
              [formControl]="newConversationForm.controls.meteringPointId"
            />

            <vater-stack direction="row" gap="m">
              <watt-separator orientation="vertical" />
              <watt-description-list [groupsPerRow]="1">
                <watt-description-list-item
                  [label]="'Adresse'"
                  [value]="'Energivej\\n7000 Fredericia'"
                />
                <watt-description-list-item
                  [label]="'Målepunktstype'"
                  [value]="'Forbrug (E17)'"
                />
              </watt-description-list>
            </vater-stack>

            <watt-dropdown
              [formControl]="newConversationForm.controls.subject"
              [options]="subjects"
              [label]="t('subjectLabel')"
              [showResetOption]="false"
              dhDropdownTranslator
              translateKey="meteringPoint.actorConversation.subjects"
              data-testid="actor-conversation-subject-dropdown"
            />
            @if (isElectricalHeating()) {
              <watt-slide-toggle
                [formControl]="newConversationForm.controls.reducedElectricityTax"
              >
                {{ t('reducedElectricityTaxToggle') }}
              </watt-slide-toggle>
            }
            <vater-flex fill="horizontal" direction="row" gap="m" align="start">
              <dh-actor-conversation-receiver-radio-group
                [marketRole]="currentActorMarketRole"
                [receiverControl]="newConversationForm.controls.receiver"
                [dateControl]="newConversationForm.controls.energySupplierDate"
              />
            </vater-flex>
            <watt-text-field
              [formControl]="newConversationForm.controls.internalNote"
              [label]="t('internalNoteLabelWithDisclaimer')"
              [maxLength]="internalNoteMaxLength"
              data-testid="actor-conversation-internal-note-input"
            />
          </vater-stack>
        </vater-grid-area>
        <vater-grid-area column="1 / span 2" row="2" fill="horizontal">
          <vater-stack fill="vertical" justify="end">
            <dh-actor-conversation-message-form
              vater
              fill="horizontal"
              [loading]="uploading() || startConversationMutation.loading()"
              [uploadError]="uploadError()"
              [formControl]="newConversationForm.controls.message"
            />
          </vater-stack>
        </vater-grid-area>
        @if (shouldShowElectricalHeatingForm()) {
          <vater-grid-area column="2" row="1">
            <dh-actor-conversation-electrical-heating-form
              [formControl]="newConversationForm.controls.electricalHeating"
              [electricalHeatingInformation]="electricalHeatingInformation()"
            />
          </vater-grid-area>
        }
      </vater-grid>
    </form>
  `,
})
export class DhGlobalNewConversationComponent {
  internalNoteMaxLength = internalNoteMaxLength;

  private readonly uploadMessageDocument = injectUploadMessageDocument();
  private readonly startConversationErrorToast = injectToast(
    'meteringPoint.actorConversation.startConversationError'
  );
  readonly currentActorMarketRole = inject(DhActorStorage).getSelectedActor().marketRole;

  uploading = signal(false);
  uploadError = signal(false);
  startConversationMutation = mutation(StartConversationDocument);

  private readonly meteringPointIdFormValue = dhFormControlToSignal(
    () => this.newConversationForm.controls.meteringPointId
  );

  meteringPointIdFromSearch = computed(
    () => this.meteringPointIdFormValue() ?? undefined
  );

  electricHeatingInformationQuery = query(GetElectricalHeatingDocument, () => ({
    variables: {
      meteringPointIdentification: this.meteringPointIdFromSearch(),
    },
  }));
  electricalHeatingInformation = computed(
    () => this.electricHeatingInformationQuery.data()?.electricalHeatingInformation ?? undefined
  );

  closeNewConversation = output<string | undefined>();

  subjects = dhEnumToWattDropdownOptions(ConversationSubject);

  newConversationForm = new FormGroup({
    meteringPointId: dhMakeFormControl<string>('', Validators.required),
    subject: dhMakeFormControl<ConversationSubject | null>(null, Validators.required),
    receiver: dhMakeFormControl<MarketRole | null>(null, Validators.required),
    energySupplierDate: dhMakeFormControl<Date | null>(null),
    internalNote: dhMakeFormControl<string | null>(
      null,
      Validators.maxLength(internalNoteMaxLength)
    ),
    reducedElectricityTax: dhMakeFormControl<boolean>(false),
    electricalHeating: dhMakeFormControl<ElectricalHeatingFormValue | null>(null),
    message: dhMakeFormControl<MessageFormValue>({ content: '', anonymous: false, files: [] }, [
      (control) =>
        control.value.content || control.value.files?.length ? null : { required: true },
      Validators.maxLength(messageMaxLength),
    ]),
  });

  private readonly subjectValue = dhFormControlToSignal(
    () => this.newConversationForm.controls.subject
  );

  private readonly receiverValue = dhFormControlToSignal(
    () => this.newConversationForm.controls.receiver
  );

  isElectricalHeating = computed(
    () => this.subjectValue() === ConversationSubject.ElectricalHeating
  );

  private readonly syncEnergySupplierDateValidators = effect(() => {
    const energySupplierDateControl = this.newConversationForm.controls.energySupplierDate;
    if (this.receiverValue() === MarketRole.EnergySupplier) {
      energySupplierDateControl.addValidators(Validators.required);
    } else {
      energySupplierDateControl.removeValidators(Validators.required);
      energySupplierDateControl.reset();
    }
    energySupplierDateControl.updateValueAndValidity();
  });

  private readonly reducedElectricityTaxValue = dhFormControlToSignal(
    () => this.newConversationForm.controls.reducedElectricityTax
  );

  shouldShowElectricalHeatingForm = computed(
    () => this.isElectricalHeating() && this.reducedElectricityTaxValue()
  );

  private readonly syncElectricalHeatingValidators = effect(() => {
    const electricalHeatingControl = this.newConversationForm.controls.electricalHeating;
    if (this.shouldShowElectricalHeatingForm()) {
      electricalHeatingControl.addValidators(Validators.required);
    } else {
      electricalHeatingControl.removeValidators(Validators.required);
      electricalHeatingControl.reset();
    }
    electricalHeatingControl.updateValueAndValidity();
  });

  async startConversation() {
    if (this.newConversationForm.invalid) return;

    const {
      meteringPointId,
      subject,
      receiver,
      internalNote,
      message,
      energySupplierDate,
      electricalHeating,
    } = this.newConversationForm.getRawValue();

    if (!receiver || !subject) return;
    if (this.uploading()) return;

    const meteringPointIdentification = meteringPointId;
    assertIsDefined(meteringPointIdentification);

    const { content, anonymous, files } = message ?? {};

    assertIsDefined(anonymous);

    this.uploadError.set(false);
    this.uploading.set(true);

    let attachedDocumentIds: string[];
    try {
      attachedDocumentIds = await Promise.all(
        (files ?? []).map((file) => this.uploadMessageDocument(file))
      );
    } catch {
      this.uploadError.set(true);
      this.uploading.set(false);
      return;
    }

    this.uploading.set(false);

    let electricalHeatingInput: StartElectricalHeatingConversationInput | undefined;
    if (this.shouldShowElectricalHeatingForm() && electricalHeating) {
      assertIsDefined(electricalHeating.addressEligibilityDate);
      assertIsDefined(electricalHeating.periodStart);
      electricalHeatingInput = {
        addressEligibilityDate: electricalHeating.addressEligibilityDate,
        chargeReductionPeriodFrom: electricalHeating.periodStart,
        chargeReductionPeriodTo: electricalHeating.periodEnd ?? undefined,
      };
    }

    const result = await this.startConversationMutation.mutate({
      variables: {
        meteringPointIdentification,
        subject,
        internalNote,
        content: content ?? '',
        anonymous,
        receiver,
        energySupplierDate,
        attachedDocumentIds,
        electricalHeatingInput,
      },
      refetchQueries: [GetConversationsDocument],
      awaitRefetchQueries: true,
    });

    const newConversationId = result.data?.startConversation?.string;
    this.closeNewConversation.emit(newConversationId ?? undefined);
  }
}

