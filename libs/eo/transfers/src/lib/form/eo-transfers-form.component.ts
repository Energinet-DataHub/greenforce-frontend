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
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalActionsComponent } from '@energinet-datahub/watt/modal';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { translations } from '@energinet-datahub/eo/translations';

import {
  endDateMustBeLaterThanStartDateValidator,
  minTodayValidator,
  nextHourOrLaterValidator,
  overlappingTransferAgreementsValidator,
} from '../validations';
import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';
import { EoTransfersPeriodComponent } from './eo-transfers-period.component';
import { EoTransfersDateTimeComponent } from './eo-transfers-date-time.component';
import { EoTransferErrorsComponent } from './eo-transfers-errors.component';
import { EoTransferInvitationLinkComponent } from './eo-invitation-link';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { EoListedTransfer, TransferAgreementType } from '../eo-transfers.service';
import { EoExistingTransferAgreement } from '../existing-transfer-agreement';
import { EoReceiverInputComponent } from './eo-receiver-input.component';
import { EoSenderInputComponent, Sender } from './eo-sender-input.component';
import { Actor } from '@energinet-datahub/eo/auth/domain';

export interface EoTransfersFormValues {
  senderTin?: string;
  receiverTin: string;
  period: { startDate: number; endDate: number | null; hasEndDate: boolean };
  transferAgreementType: TransferAgreementType;
  isProposal: boolean;
}

export type FormMode = 'create' | 'edit';

export interface EoTransfersFormInitialValues {
  senderTin?: string;
  receiverTin?: string;
  startDate?: number;
  endDate?: number | null;
  transferAgreementType?: TransferAgreementType;
}

export interface EoTransferFormPeriod {
  startDate: FormControl<number | null | undefined>;
  endDate: FormControl<number | null | undefined>;
}

export interface EoTransfersForm {
  senderTin: FormControl<string | null>;
  receiverTin: FormControl<string | null>;
  period: FormGroup<EoTransferFormPeriod>;
  transferAgreementType: FormControl<string | null>;
}

type FormField = 'senderTin' | 'receiverTin' | 'startDate' | 'endDate' | 'transferAgreementType';

@Component({
  selector: 'eo-transfers-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WattModalActionsComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    EoTransfersPeriodComponent,
    EoTransfersTimepickerComponent,
    WattRadioComponent,
    NgClass,
    WattDatePipe,
    CommonModule,
    EoTransfersDateTimeComponent,
    EoTransferErrorsComponent,
    WATT_STEPPER,
    EoTransferInvitationLinkComponent,
    VaterStackComponent,
    WattFieldHintComponent,
    TranslocoPipe,
    EoReceiverInputComponent,
    EoSenderInputComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      eo-transfers-form .fieldset {
        display: flex;
        flex-wrap: wrap;
      }

      eo-transfers-form form {
        height: 100%;
      }

      eo-transfers-form watt-stepper-content-wrapper {
        min-height: 341px;
      }

      eo-transfers-form .receiver,
      eo-transfers-form .timeframe-step {
        gap: var(--watt-space-l);
        display: flex;
        flex-direction: column;
      }

      eo-transfers-form .descriptor {
        color: var(--watt-color-neutral-grey-700);
        font-size: 14px;
        font-weight: normal;
      }

      eo-transfers-form .sender .watt-field-wrapper {
        max-width: 330px;
      }

      eo-transfers-form .receiver .watt-field-wrapper {
        max-width: 330px;
      }

      .transfer-agreement-type-radios {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-m);
        margin-top: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <!-- Create -->
    @if (mode() === 'create') {
      <form [formGroup]="form">
        <watt-stepper
          (completed)="createTransferAgreement()"
          class="watt-modal-content--full-width"
        >
          <!-- Step 1 Parties -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.parties.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.parties.nextLabel | transloco
            "
            [stepControl]="form.controls.receiverTin"
            (leaving)="onLeavingPartiesStep()"
          >
            @if (actors().length > 1) {
              <h3 class="watt-headline-2">
                {{ translations.createTransferAgreementProposal.parties.titleBetween | transloco }}
              </h3>
            } @else {
              <h3 class="watt-headline-2">
                {{ translations.createTransferAgreementProposal.parties.titleTo | transloco }}
              </h3>
            }
            <p>
              {{ translations.createTransferAgreementProposal.parties.description | transloco }}
            </p>
            <eo-sender-input
              class="sender"
              [senders]="senders()"
              (onSenderChange)="onSenderTinChange($event)"
              formControlName="senderTin"
            />
            <eo-receiver-input
              class="receiver"
              formControlName="receiverTin"
              [formControl]="form.controls.receiverTin"
              [mode]="mode()"
              [filteredReceiverTins]="filteredReceiverTins()"
              [selectedCompanyName]="selectedCompanyName()"
              (selectedCompanyNameChange)="selectedCompanyName.set($event)"
              (searchChange)="onSearch($event)"
              (tinChange)="form.controls.receiverTin.setValue($event)"
            />
          </watt-stepper-step>
          <!-- Step 2 Timeframe -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.timeframe.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.timeframe.nextLabel | transloco
            "
            [previousButtonLabel]="
              translations.createTransferAgreementProposal.timeframe.previousLabel | transloco
            "
            (entering)="onEnteringTimeframeStep()"
            (leaving)="onLeavingTimeframeStep()"
            [stepControl]="form.controls.period"
          >
            <div class="timeframe-step">
              <h2>
                {{ translations.createTransferAgreementProposal.timeframe.title | transloco }}
              </h2>
              <p>
                {{ translations.createTransferAgreementProposal.timeframe.description | transloco }}
              </p>

              <eo-transfers-form-period
                formGroupName="period"
                [existingTransferAgreements]="existingTransferAgreements()"
              />
            </div>
          </watt-stepper-step>
          <!-- Step 3 Volume -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.volume.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.volume.nextLabel | transloco
            "
            [disableNextButton]="generateProposalFailed()"
            [previousButtonLabel]="
              translations.createTransferAgreementProposal.volume.previousLabel | transloco
            "
          >
            <h2>{{ translations.createTransferAgreementProposal.volume.title | transloco }}</h2>
            <div class="transfer-agreement-type-radios">
              <watt-radio
                [formControl]="form.controls.transferAgreementType"
                group="transfer_agreement_type"
                value="TransferCertificatesBasedOnConsumption"
                >{{ translations.createTransferAgreementProposal.volume.matchReceiver | transloco }}
              </watt-radio>
              <watt-radio
                [formControl]="form.controls.transferAgreementType"
                group="transfer_agreement_type"
                value="TransferAllCertificates"
              >
                {{ translations.createTransferAgreementProposal.volume.everything | transloco }}
              </watt-radio>
            </div>
          </watt-stepper-step>
          <!-- Step 4 Summary -->
          @if (hasConsentForReceiver()) {
            <!-- Ready -->
            <watt-stepper-step
              [label]="translations.createTransferAgreementProposal.summary.stepLabel | transloco"
              [nextButtonLabel]="
                translations.createTransferAgreementProposal.summary.ready.nextLabel | transloco
              "
              [disableNextButton]="generateProposalFailed()"
              [previousButtonLabel]="
                translations.createTransferAgreementProposal.summary.previousLabel | transloco
              "
            >
              <h2>
                {{ translations.createTransferAgreementProposal.summary.ready.title | transloco }}
              </h2>
            </watt-stepper-step>
          } @else {
            <!-- Invitation Link -->
            <watt-stepper-step
              [label]="translations.createTransferAgreementProposal.summary.stepLabel | transloco"
              [nextButtonLabel]="
                translations.createTransferAgreementProposal.summary.invitation.nextLabel
                  | transloco
              "
              [disableNextButton]="generateProposalFailed()"
              [previousButtonLabel]="
                translations.createTransferAgreementProposal.summary.previousLabel | transloco
              "
              (entering)="createTransferAgreement()"
              (next)="closeAndCopyLink()"
            >
              <vater-stack direction="column" gap="l" align="flex-start">
                @if (!generateProposalFailed()) {
                  <h2>
                    {{
                      translations.createTransferAgreementProposal.summary.invitation.title.success
                        | transloco
                    }}
                  </h2>
                  <div
                    [innerHTML]="
                      translations.createTransferAgreementProposal.summary.invitation.description
                        .success | transloco
                    "
                  ></div>
                } @else {
                  <h2>
                    {{
                      translations.createTransferAgreementProposal.summary.invitation.title.error
                        | transloco
                    }}
                  </h2>
                  <div
                    [innerHTML]="
                      translations.createTransferAgreementProposal.summary.invitation.description
                        .error | transloco
                    "
                  ></div>
                }
                <eo-transfers-invitation-link
                  [proposalId]="proposalId()"
                  [hasError]="generateProposalFailed()"
                  (retry)="createTransferAgreement()"
                  #invitationLink
                />
              </vater-stack>
            </watt-stepper-step>
          }
        </watt-stepper>
      </form>
      <!-- Edit -->
    } @else {
      <form [formGroup]="form">
        <eo-receiver-input
          [formControl]="form.controls.receiverTin"
          [mode]="mode()"
          [filteredReceiverTins]="filteredReceiverTins()"
          [selectedCompanyName]="selectedCompanyName()"
        />

        <eo-transfers-form-period
          mode="edit"
          formGroupName="period"
          [existingTransferAgreements]="existingTransferAgreements()"
        />

        <watt-modal-actions>
          <watt-button
            variant="secondary"
            data-testid="close-new-agreement-button"
            (click)="onCancel()"
          >
            {{ cancelButtonText() }}
          </watt-button>
          <watt-button
            data-testid="create-new-agreement-button"
            (click)="createTransferAgreement()"
          >
            {{ submitButtonText() }}
          </watt-button>
        </watt-modal-actions>
      </form>
    }
  `,
})
export class EoTransfersFormComponent implements OnInit {
  transferId = input<string | undefined>(''); // used in edit mode
  mode = input<FormMode>('create');
  submitButtonText = input<string>('');
  cancelButtonText = input<string>('');
  initialValues = input<EoTransfersFormInitialValues>({
    senderTin: '',
    receiverTin: '',
    startDate: new Date().setHours(new Date().getHours() + 1, 0, 0, 0),
    endDate: null,
    transferAgreementType: 'TransferAllCertificates',
  });
  editableFields = input<FormField[]>([
    'senderTin',
    'receiverTin',
    'startDate',
    'endDate',
    'transferAgreementType',
  ]);

  transferAgreements = input<EoListedTransfer[]>([]);
  actors = input.required<Actor[]>();
  proposalId = input<string | null>(null);
  generateProposalFailed = input<boolean>(false);

  submitted = output<EoTransfersFormValues>();
  canceled = output();

  @ViewChild('invitationLink') invitationLink!: EoTransferInvitationLinkComponent;

  protected translations = translations;
  protected form!: FormGroup<EoTransfersForm>;
  protected filteredReceiverTins = signal<string[]>([]);
  protected senders = signal<Sender[]>([]);
  protected existingTransferAgreements = signal<EoExistingTransferAgreement[]>([]);
  protected selectedCompanyName = signal<string | undefined>(undefined);
  protected hasConsentForReceiver = signal<boolean>(false);

  private transloco = inject(TranslocoService);

  onEnteringTimeframeStep() {
    this.setExistingTransferAgreements();
    this.form.controls.period.setValidators(this.getPeriodValidators());
    this.form.controls.period.updateValueAndValidity();
  }

  onLeavingTimeframeStep() {
    this.existingTransferAgreements.set([]);
  }

  constructor() {
    this.initForm();

    effect(
      () => {
        if (this.existingTransferAgreements()) {
          this.form.controls.period.setValidators(this.getPeriodValidators());
          this.form.controls.period.updateValueAndValidity();
        }

        this.onSearch('');
      },
      {
        allowSignalWrites: true,
      }
    );

    effect(
      () => {
        const actors = this.actors();
        this.senders.set(
          actors.map((actor) => ({
            tin: actor.tin,
            name: actor.org_name,
          }))
        );
      },
      {
        allowSignalWrites: true,
      }
    );

    effect(
      () => {
        const initialValues = this.initialValues();
        this.form.controls.senderTin.setValue(initialValues.senderTin ?? '', { emitEvent: false });
        this.form.controls.receiverTin.setValue(initialValues.receiverTin ?? '', {
          emitEvent: false,
        });
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnInit(): void {
    if (this.mode() === 'edit') {
      this.setExistingTransferAgreements();
    }
  }

  protected onSearch(query: string) {
    const senderTin = this.form.controls.senderTin.value ?? '';
    this.setFilteredReceiverTins(query, senderTin);
  }

  setFilteredReceiverTins(query: string, senderTin: string) {
    const filteredReceivers = this.getReceiverTins(this.transferAgreements(), senderTin).filter(
      (receiverTin) => receiverTin.includes(query)
    );
    this.filteredReceiverTins.set(filteredReceivers);
  }

  private getReceiverTins(
    transferAgreements: EoListedTransfer[],
    selectedSenderTin: string
  ): string[] {
    const tins = transferAgreements.reduce((acc, transfer) => {
      if (transfer.receiverTin !== this.form.controls.senderTin.value) {
        acc.push(this.getReceiverTinLabel(transfer.receiverTin, transfer.receiverName));
      }
      if (transfer.senderTin !== selectedSenderTin) {
        acc.push(this.getReceiverTinLabel(transfer.senderTin, transfer.senderName));
      }
      return acc;
    }, [] as string[]);

    const tinsFromSenders = this.senders()
      .filter((sender) => sender.tin !== selectedSenderTin)
      .map((sender) => this.getReceiverTinLabel(sender.tin, sender.name));

    return [...new Set(tins), ...tinsFromSenders];
  }

  public getReceiverTinLabel(tin: string, name: string | undefined | null) {
    const fallbackCompanyName = this.transloco.translate(
      this.translations.createTransferAgreementProposal.parties.unknownParty
    );
    return `${tin} - ${name ?? fallbackCompanyName}`;
  }

  onSenderTinChange(senderTin: string) {
    this.setFilteredReceiverTins('', senderTin);
    if (this.form.controls.receiverTin.value === senderTin) {
      this.form.controls.receiverTin.reset();
    }
  }

  protected onCancel() {
    this.canceled.emit();
  }

  protected onClose() {
    this.onCancel();
  }

  protected closeAndCopyLink() {
    this.invitationLink.copy();
    this.onClose();
  }

  createTransferAgreement() {
    const formValue = this.form.value;
    const eoTransfersFormValues: EoTransfersFormValues = {
      senderTin: formValue.senderTin ?? undefined,
      receiverTin: formValue.receiverTin as string,
      period: {
        startDate: formValue.period?.startDate as number,
        endDate: formValue.period?.endDate as number | null,
        hasEndDate: formValue.period?.endDate !== null,
      },
      transferAgreementType:
        (formValue.transferAgreementType as TransferAgreementType) ?? 'TransferAllCertificates',
      isProposal: !this.hasConsentForReceiver(),
    };
    this.submitted.emit(eoTransfersFormValues);
    this.onClose();
  }

  private setExistingTransferAgreements() {
    const receiver = this.form.controls.receiverTin.value;
    if (!receiver) this.existingTransferAgreements.set([]);

    this.existingTransferAgreements.set(
      this.transferAgreements()
        .filter((transfer) => transfer.id !== this.transferId()) // used in edit mode
        .filter((transfer) => transfer.receiverTin === receiver)
        .map((transfer) => {
          return { startDate: transfer.startDate, endDate: transfer.endDate };
        })
        // Filter out transfers that have ended
        .filter((transfer) => transfer.endDate === null || transfer.endDate > new Date().getTime())
        // TODO: CONSIDER MOVING THE SORTING
        .sort((a, b) => {
          if (a.endDate === null) return 1; // a is lesser if its endDate is null
          if (b.endDate === null) return -1; // b is lesser if its endDate is null
          return a.endDate - b.endDate;
        })
    );
  }

  private initForm() {
    const { senderTin, receiverTin, startDate, endDate, transferAgreementType } =
      this.initialValues();

    this.form = new FormGroup<EoTransfersForm>({
      senderTin: new FormControl({
        value: senderTin ?? '',
        disabled: !this.editableFields().includes('senderTin'),
      }),
      receiverTin: new FormControl({
        value: receiverTin ?? '',
        disabled: !this.editableFields().includes('receiverTin'),
      }),
      period: new FormGroup(
        {
          startDate: new FormControl(
            {
              value: startDate,
              disabled: !this.editableFields().includes('startDate'),
            },
            {
              validators: [Validators.required, nextHourOrLaterValidator()],
            }
          ),
          endDate: new FormControl(
            {
              value: endDate,
              disabled: !this.editableFields().includes('endDate'),
            },
            { validators: [minTodayValidator()] }
          ),
        },
        {
          validators: this.getPeriodValidators(),
        }
      ),
      transferAgreementType: new FormControl<string>({
        value: transferAgreementType ?? 'TransferAllCertificates',
        disabled: !this.editableFields().includes('transferAgreementType'),
      }),
    });
  }

  getPeriodValidators() {
    return [
      endDateMustBeLaterThanStartDateValidator(),
      overlappingTransferAgreementsValidator(this.existingTransferAgreements()),
    ];
  }

  onLeavingPartiesStep() {
    const receiver = this.form.controls.receiverTin.value;
    this.hasConsentForReceiver.set(
      this.actors().some((actor: Actor) => {
        return actor.tin === receiver;
      })
    );
  }
}
