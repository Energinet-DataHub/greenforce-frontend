import { Component, ViewEncapsulation, inject, viewChild } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, translate } from '@ngneat/transloco';
import { distinctUntilKeyChanged } from 'rxjs';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { dayjs } from '@energinet-datahub/watt/date';
import {
  GetAuditLogByActorIdDocument,
  GetDelegationsForActorDocument,
  StopDelegationsDocument,
  StopDelegationsMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';

import { DhDelegation } from '../dh-delegations';
import { dhDateCannotBeOlderThanTodayValidator } from '../dh-delegation-validators';

@Component({
  standalone: true,
  selector: 'dh-delegation-stop-modal',
  encapsulation: ViewEncapsulation.None,
  styles: `
    dh-delegation-stop-modal {
      display: block;

      vater-stack[align='flex-start'] {
        margin-top: var(--watt-space-m);
      }

      watt-datepicker {
        watt-field {
          span.label {
            display: none;
          }
        }
      }
    }
  `,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    WattRadioComponent,
    WattFieldErrorComponent,

    VaterStackComponent,
  ],
  template: `<watt-modal
    [title]="t('stopModalTitle')"
    *transloco="let t; read: 'marketParticipant.delegation'"
  >
    <form
      id="stop-delegation-form"
      [formGroup]="stopDelegationForm"
      (ngSubmit)="stopSelectedDelegations()"
    >
      <vater-stack align="flex-start" gap="m">
        <watt-radio
          group="stopDate"
          [formControl]="stopDelegationForm.controls.selectedOption"
          value="stopNow"
          >{{ t('stopNow') }}</watt-radio
        >
        <vater-stack direction="row" align="baseline" gap="m">
          <watt-radio
            group="stopDate"
            [formControl]="stopDelegationForm.controls.selectedOption"
            value="stopOnDate"
          >
            {{ t('stopDate') }}
          </watt-radio>
          <watt-datepicker [min]="today" [formControl]="stopDelegationForm.controls.stopDate">
            @if (
              stopDelegationForm.controls.stopDate.errors?.['dateCannotBeOlderThanTodayValidator']
            ) {
              <watt-field-error>
                {{ t('stopDateError') }}
              </watt-field-error>
            }
          </watt-datepicker>
        </vater-stack>
      </vater-stack>
    </form>
    <watt-modal-actions>
      <watt-button (click)="closeModal(false)" variant="secondary">
        {{ t('cancel') }}
      </watt-button>

      <watt-button
        [loading]="isSaving()"
        formId="stop-delegation-form"
        type="submit"
        variant="primary"
      >
        {{ t('shared.stopDelegation') }}
      </watt-button>
    </watt-modal-actions>
  </watt-modal>`,
})
export class DhDelegationStopModalComponent extends WattTypedModal<DhDelegation[]> {
  private formBuilder = inject(NonNullableFormBuilder);
  private toastService = inject(WattToastService);

  private stopDelegationsMutation = mutation(StopDelegationsDocument);

  today = new Date();
  isSaving = this.stopDelegationsMutation.loading;

  modal = viewChild.required(WattModalComponent);

  stopDelegationForm = this.formBuilder.group({
    selectedOption: new FormControl<'stopNow' | 'stopOnDate'>('stopNow', { nonNullable: true }),
    stopDate: [
      { value: null, disabled: true },
      [Validators.required, dhDateCannotBeOlderThanTodayValidator()],
    ],
  });

  constructor() {
    super();

    this.stopDelegationForm.valueChanges
      .pipe(takeUntilDestroyed(), distinctUntilKeyChanged('selectedOption'))
      .subscribe((value) => {
        if (value.selectedOption === 'stopNow') {
          this.stopDelegationForm.controls.stopDate.disable();
        } else {
          this.stopDelegationForm.controls.stopDate.enable();
        }
      });
  }

  closeModal(result: boolean) {
    this.modal().close(result);
  }

  stopSelectedDelegations() {
    if (this.stopDelegationForm.invalid) return;

    const { stopDate, selectedOption } = this.stopDelegationForm.getRawValue();

    if (!stopDate && selectedOption === 'stopOnDate') return;

    this.stopDelegationsMutation.mutate({
      variables: {
        input: {
          stopDelegationPeriods: this.modalData.map((delegation) => ({
            delegationId: delegation.id,
            stopPeriod: {
              periodId: delegation.periodId,
              stopsAt: this.calculateStopDate(selectedOption, stopDate),
            },
          })),
        },
      },
      refetchQueries: [GetDelegationsForActorDocument, GetAuditLogByActorIdDocument],
      onCompleted: (data) => this.handleStopDelegationResponse(data),
    });
  }

  private calculateStopDate(selectedOption: string, stopDate: Date | null): Date | null {
    if (selectedOption === 'stopNow') {
      // Subtract 1 minute to ensure that the stop time is in the past
      // compared to the time in the backend.
      return dayjs(new Date()).subtract(1, 'minute').toDate();
    }

    return stopDate
      ? // Add 1 day to ensure that the stop day is included in the period.
        // Normally:
        // Selecting "2024-03-27" results in "2024-03-26T23:00:00Z"
        // After:
        // Selecting "2024-03-27" results in "2024-03-27T23:00:00Z"
        dayjs(stopDate).add(1, 'day').toDate()
      : stopDate;
  }

  private handleStopDelegationResponse({ stopDelegation }: StopDelegationsMutation): void {
    if (stopDelegation.errors && stopDelegation.errors.length > 0) {
      this.toastService.open({
        type: 'danger',
        message: readApiErrorResponse(stopDelegation.errors),
      });
    }

    if (stopDelegation.success) {
      this.toastService.open({
        type: 'success',
        message: translate('marketParticipant.delegation.stopDelegationSuccess'),
      });
    }

    this.closeModal(true);
  }
}
