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
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ViewChild,
  signal,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalActionsComponent } from '@energinet-datahub/watt/modal';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_STEPPER, WattStep } from '@energinet-datahub/watt/stepper';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { translations } from '@energinet-datahub/ett/translations';

import {
  compareValidator,
  endDateMustBeLaterThanStartDateValidator,
  minTodayValidator,
  nextHourOrLaterValidator,
  overlappingTransferAgreementsValidator,
} from '../validations';
import { EttTransfersTimepickerComponent } from './ett-transfers-timepicker.component';
import { EttTransfersPeriodComponent } from './ett-transfers-period.component';
import { EttTransfersDateTimeComponent } from './ett-transfers-date-time.component';
import { EttTransferErrorsComponent } from './ett-transfers-errors.component';
import { EttTransferInvitationLinkComponent } from './ett-invitation-link';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { EttListedTransfer } from '../ett-transfers.service';
import { EttExistingTransferAgreement } from '../existing-transfer-agreement';

export interface EttTransfersFormInitialValues {
  receiverTin: string;
  startDate: number;
  endDate: number | null;
}

export interface EttTransferFormPeriod {
  startDate: FormControl<number | null>;
  endDate: FormControl<number | null>;
}

export interface EttTransfersForm {
  receiverTin: FormControl<string | null>;
  period: FormGroup<EttTransferFormPeriod>;
}

type FormField = 'receiverTin' | 'startDate' | 'endDate';

@Component({
  selector: 'ett-transfers-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WattModalActionsComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    EttTransfersPeriodComponent,
    EttTransfersTimepickerComponent,
    WattRadioComponent,
    NgClass,
    WattDatePipe,
    CommonModule,
    EttTransfersDateTimeComponent,
    EttTransferErrorsComponent,
    WATT_STEPPER,
    EttTransferInvitationLinkComponent,
    VaterStackComponent,
    WattFieldHintComponent,
    TranslocoPipe,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ett-transfers-form .fieldset {
        display: flex;
        flex-wrap: wrap;
      }

      ett-transfers-form form {
        height: 100%;
      }

      ett-transfers-form watt-stepper-content-wrapper {
        min-height: 341px;
      }

      ett-transfers-form .receiver,
      ett-transfers-form .timeframe-step {
        gap: var(--watt-space-l);
        display: flex;
        flex-direction: column;
      }

      ett-transfers-form .descriptor {
        color: var(--watt-color-neutral-grey-700);
        font-size: 14px;
        font-weight: normal;
      }

      ett-transfers-form .receiver .watt-field-wrapper {
        max-width: 330px;
      }
    `,
  ],
  template: `
    @if (mode === 'create') {
      <form [formGroup]="form">
        <watt-stepper (completed)="onClose()" class="watt-modal-content--full-width">
          <!-- Recipient -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.recipient.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.recipient.nextLabel | transloco
            "
            [stepControl]="form.controls.receiverTin"
          >
            <ng-container *ngTemplateOutlet="receiver" />
          </watt-stepper-step>
          <!-- Timeframe -->
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

              <ett-transfers-form-period
                formGroupName="period"
                [existingTransferAgreements]="existingTransferAgreements()"
              />
            </div>
          </watt-stepper-step>
          <!-- Invitation -->
          <watt-stepper-step
            [label]="translations.createTransferAgreementProposal.invitation.stepLabel | transloco"
            [nextButtonLabel]="
              translations.createTransferAgreementProposal.invitation.nextLabel | transloco
            "
            [disableNextButton]="generateProposalFailed"
            [previousButtonLabel]="
              translations.createTransferAgreementProposal.invitation.previousLabel | transloco
            "
            (entering)="onSubmit()"
            (leaving)="onLeaveInvitationStep($event)"
          >
            <vater-stack direction="column" gap="l" align="flex-start">
              @if (!generateProposalFailed) {
                <h2>
                  {{
                    translations.createTransferAgreementProposal.invitation.title.success
                      | transloco
                  }}
                </h2>
                <div
                  [innerHTML]="
                    translations.createTransferAgreementProposal.invitation.description.success
                      | transloco
                  "
                ></div>
              } @else {
                <h2>
                  {{
                    translations.createTransferAgreementProposal.invitation.title.error | transloco
                  }}
                </h2>
                <div
                  [innerHTML]="
                    translations.createTransferAgreementProposal.invitation.description.error
                      | transloco
                  "
                ></div>
              }
              <ett-transfers-invitation-link
                [proposalId]="proposalId"
                [hasError]="generateProposalFailed"
                (retry)="onSubmit()"
                #invitaionLink
              />
            </vater-stack>
          </watt-stepper-step>
        </watt-stepper>
      </form>
    } @else {
      <form [formGroup]="form">
        <ng-container *ngTemplateOutlet="receiver" />
        <ett-transfers-form-period
          formGroupName="period"
          [existingTransferAgreements]="existingTransferAgreements()"
        />

        <watt-modal-actions>
          <watt-button
            variant="secondary"
            data-testid="close-new-agreement-button"
            (click)="onCancel()"
          >
            {{ cancelButtonText }}
          </watt-button>
          <watt-button data-testid="create-new-agreement-button" (click)="onSubmit()">
            {{ submitButtonText }}
          </watt-button>
        </watt-modal-actions>
      </form>
    }

    <ng-template #receiver>
      <div class="receiver">
        @if (mode === 'create') {
          <h3 class="watt-headline-2">
            {{ translations.createTransferAgreementProposal.recipient.title | transloco }}
          </h3>
          <p>
            {{ translations.createTransferAgreementProposal.recipient.description | transloco }}
          </p>
        }

        <div style="display: flex; align-items: center;">
          <watt-text-field
            [label]="
              translations.createTransferAgreementProposal.recipient.receiverTinLabel | transloco
            "
            [placeholder]="
              translations.createTransferAgreementProposal.recipient.receiverTinPlaceholder
                | transloco
            "
            type="text"
            [formControl]="form.controls.receiverTin"
            (keydown)="preventNonNumericInput($event)"
            data-testid="new-agreement-receiver-input"
            [autocompleteOptions]="filteredReceiversTin()"
            (search)="onSearch($event)"
            (autocompleteOptionSelected)="onSelectedRecipient($event)"
            (autocompleteOptionDeselected)="selectedCompanyName.set(undefined)"
            [autocompleteMatcherFn]="isRecipientMatchingOption"
            [maxLength]="8"
            #recipientInput
          >
            @if (!form.controls.receiverTin.errors && mode === 'create') {
              <watt-field-hint
                [innerHTML]="
                  translations.createTransferAgreementProposal.recipient.receiverTinGeneralError
                    | transloco
                "
              />
            }

            @if (form.controls.receiverTin.errors?.['receiverTinEqualsSenderTin']) {
              <watt-field-error
                [innerHTML]="
                  translations.createTransferAgreementProposal.recipient.receiverTinEqualsSenderTin
                    | transloco
                "
              />
            }

            @if (form.controls.receiverTin.errors?.['pattern']) {
              <watt-field-error
                [innerHTML]="
                  translations.createTransferAgreementProposal.recipient.receiverTinFormatError
                    | transloco
                "
              />
            }

            @if (selectedCompanyName()) {
              <div class="descriptor">{{ selectedCompanyName() }}</div>
            }
          </watt-text-field>
        </div>
      </div>
    </ng-template>
  `,
})
export class EttTransfersFormComponent implements OnInit, OnChanges {
  @Input() senderTin?: string;
  @Input() transferId?: string; // used in edit mode
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() submitButtonText!: string;
  @Input() cancelButtonText!: string;
  @Input() initialValues: EttTransfersFormInitialValues = {
    receiverTin: '',
    startDate: new Date().setHours(new Date().getHours() + 1, 0, 0, 0),
    endDate: null,
  };
  @Input() editableFields: FormField[] = ['receiverTin', 'startDate', 'endDate'];

  @Input() transferAgreements: EttListedTransfer[] = [];
  @Input() proposalId: string | null = null;
  @Input() generateProposalFailed = false;

  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();

  @ViewChild('invitaionLink') invitaionLink!: EttTransferInvitationLinkComponent;

  protected translations = translations;
  protected form!: FormGroup<EttTransfersForm>;
  protected filteredReceiversTin = signal<string[]>([]);
  protected existingTransferAgreements = signal<EttExistingTransferAgreement[]>([]);
  protected selectedCompanyName = signal<string | undefined>(undefined);

  private transloco = inject(TranslocoService);
  private recipientTins = signal<string[]>([]);

  onEnteringTimeframeStep() {
    this.setExistingTransferAgreements();
    this.form.controls.period.setValidators(this.getPeriodValidators());
    this.form.controls.period.updateValueAndValidity();
  }

  onLeavingTimeframeStep() {
    this.existingTransferAgreements.set([]);
  }

  onSelectedRecipient(value: string) {
    const [tin, companyName] = value.split(' - ');
    this.selectedCompanyName.set(companyName);
    this.form.controls.receiverTin.setValue(tin);
  }

  isRecipientMatchingOption(value: string, option: string) {
    return value === option.split(' - ')[0];
  }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.setExistingTransferAgreements();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) this.initForm();

    if (changes['existingTransferAgreements'] && this.form) {
      this.form.controls.period.setValidators(this.getPeriodValidators());
      this.form.controls.period.updateValueAndValidity();
    }

    if (changes['senderTin'] && this.senderTin) {
      this.recipientTins.set(this.getRecipientTins(this.transferAgreements));
      this.onSearch('');

      this.form.controls['receiverTin'].addValidators(
        compareValidator(this.senderTin, 'receiverTinEqualsSenderTin')
      );
    }
  }

  protected onSearch(query: string) {
    this.filteredReceiversTin.set(this.recipientTins().filter((tin) => tin.includes(query)));
  }

  protected onCancel() {
    this.canceled.emit();
  }

  protected onClose() {
    this.invitaionLink.copy();
    this.onCancel();
  }

  protected onSubmit() {
    this.submitted.emit(this.form.value);
  }

  onLeaveInvitationStep(step: WattStep) {
    step.reset();
  }

  protected preventNonNumericInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'Alt'];
    const selectAll = event.key === 'a' && (event.metaKey || event.ctrlKey);
    const isNumericInput = /^[0-9]+$/.test(event.key);
    const isSpecialKey = allowedKeys.includes(event.key);

    if (!isNumericInput && !isSpecialKey && !selectAll) {
      event.preventDefault();
    }
  }

  private setExistingTransferAgreements() {
    const recipient = this.form.controls.receiverTin.value;
    if (!recipient) this.existingTransferAgreements.set([]);

    this.existingTransferAgreements.set(
      this.transferAgreements
        .filter((transfer) => transfer.id !== this.transferId) // used in edit mode
        .filter((transfer) => transfer.receiverTin === recipient)
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

  private getRecipientTins(transferAgreements: EttListedTransfer[]) {
    const fallbackCompanyName = this.transloco.translate(
      this.translations.createTransferAgreementProposal.recipient.unknownRecipient
    );
    const tins = transferAgreements.reduce((acc, transfer) => {
      if (transfer.receiverTin !== this.senderTin) {
        acc.push(`${transfer.receiverTin} - ${transfer.receiverName ?? fallbackCompanyName}`);
      }
      if (transfer.senderTin !== this.senderTin) {
        acc.push(`${transfer.senderTin} - ${transfer.senderName ?? fallbackCompanyName}`);
      }
      return acc;
    }, [] as string[]);

    return [...new Set(tins)];
  }

  private initForm() {
    const { receiverTin, startDate, endDate } = this.initialValues;

    this.form = new FormGroup<EttTransfersForm>({
      receiverTin: new FormControl(
        {
          value: receiverTin || '',
          disabled: !this.editableFields.includes('receiverTin'),
        },
        {
          validators: [Validators.pattern('^[0-9]{8}$')],
        }
      ),
      period: new FormGroup(
        {
          startDate: new FormControl(
            {
              value: startDate,
              disabled: !this.editableFields.includes('startDate'),
            },
            {
              validators: [Validators.required, nextHourOrLaterValidator()],
            }
          ),
          endDate: new FormControl(
            {
              value: endDate,
              disabled: !this.editableFields.includes('endDate'),
            },
            { validators: [minTodayValidator()] }
          ),
        },
        {
          validators: this.getPeriodValidators(),
        }
      ),
    });
  }

  getPeriodValidators() {
    return [
      endDateMustBeLaterThanStartDateValidator(),
      overlappingTransferAgreementsValidator(this.existingTransferAgreements()),
    ];
  }
}
