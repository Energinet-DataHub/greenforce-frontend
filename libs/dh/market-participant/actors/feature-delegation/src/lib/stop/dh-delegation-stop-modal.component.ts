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
import { Component, ViewChild, ViewEncapsulation, inject, signal } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Apollo, MutationResult } from 'apollo-angular';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerV2Component } from '@energinet-datahub/watt/datepicker';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';

import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

import {
  GetDelegationsForActorDocument,
  StopDelegationsDocument,
  StopDelegationsMutation,
  StopMessageDelegationDtoInput,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDelegation } from '../dh-delegations';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'dh-delegation-stop-modal',
  encapsulation: ViewEncapsulation.None,
  styles: `
    dh-delegation-stop-modal {
      display: block;
    }
  `,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerV2Component,
    WattRadioComponent,

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
          [formControl]="stopDelegationForm.controls.selectedOptions"
          value="stopNow"
          >{{ t('stopNow') }}</watt-radio
        >
        <vater-stack direction="row" gap="m">
          <watt-radio
            group="stopDate"
            [formControl]="stopDelegationForm.controls.selectedOptions"
            value="stopOnDate"
          >
            {{ t('stopDate') }}
          </watt-radio>
          <watt-datepicker-v2 [min]="date" [formControl]="stopDelegationForm.controls.stopDate" />
        </vater-stack>
      </vater-stack>
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
    </form>
  </watt-modal>`,
})
export class DhDelegationStopModalComponent extends WattTypedModal<DhDelegation[]> {
  private _fb = inject(NonNullableFormBuilder);
  private _toastService = inject(WattToastService);
  private _apollo = inject(Apollo);

  date = new Date();
  isSaving = signal(false);

  @ViewChild(WattModalComponent)
  modal: WattModalComponent | undefined;

  stopDelegationForm = this._fb.group({
    selectedOptions: new FormControl<'stopNow' | 'stopOnDate'>('stopNow', { nonNullable: true }),
    stopDate: [{ value: null, disabled: true }, Validators.required],
  });

  constructor() {
    super();
    this.stopDelegationForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value.selectedOptions === 'stopNow') {
        this.stopDelegationForm.controls.stopDate.disable();
      } else {
        this.stopDelegationForm.controls.stopDate.enable();
      }
    });
  }

  closeModal(result: boolean) {
    this.modal?.close(result);
  }

  stopSelectedDelegations() {
    if (this.stopDelegationForm.invalid) return;

    const { stopDate, selectedOptions } = this.stopDelegationForm.getRawValue();

    if (!stopDate && selectedOptions === 'stopOnDate') return;

    this.isSaving.set(true);

    this._apollo
      .mutate({
        mutation: StopDelegationsDocument,
        refetchQueries: [GetDelegationsForActorDocument],
        variables: {
          input: {
            stopMessageDelegationDto: this.modalData.map((delegation) => {
              return {
                id: delegation.id,
                periodId: delegation.periodId,
                stopsAt: selectedOptions === 'stopNow' ? new Date() : stopDate,
              } as StopMessageDelegationDtoInput;
            }),
          },
        },
      })
      .subscribe((response) => this.handleStopDelegationResponse(response));
  }

  private handleStopDelegationResponse(response: MutationResult<StopDelegationsMutation>): void {
    if (response.errors && response.errors.length > 0) {
      this._toastService.open({
        type: 'danger',
        message: parseGraphQLErrorResponse(response.errors),
      });
    }

    if (response.data?.stopDelegation?.errors && response.data?.stopDelegation?.errors.length > 0) {
      this._toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.stopDelegation?.errors),
      });
    }

    if (response.data?.stopDelegation?.success) {
      this._toastService.open({
        type: 'success',
        message: translate('marketParticipant.delegation.stopDelegationSuccess'),
      });
    }

    this.closeModal(true);
    this.isSaving.set(false);
  }
}
