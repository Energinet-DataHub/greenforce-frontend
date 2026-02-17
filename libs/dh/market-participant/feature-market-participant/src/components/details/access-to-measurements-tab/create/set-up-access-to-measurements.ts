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
  Validators,
  FormControl,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, viewChild, inject } from '@angular/core';

import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WattToastService } from '@energinet/watt/toast';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet/watt/field';

import { mutation, MutationResult } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetMarketParticipantAuditLogsDocument,
  GetAdditionalRecipientOfMeasurementsDocument,
  AddMeteringPointsToAdditionalRecipientDocument,
  AddMeteringPointsToAdditionalRecipientMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/domain';
import { DhMarketParticipantExtended } from '@energinet-datahub/dh/market-participant/domain';
import {
  dhMeteringPointIDsValidator,
  normalizeMeteringPointIDs,
} from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-set-up-access-to-measurements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    VaterStackComponent,
    WattButtonComponent,
    WattFieldHintComponent,
    WattFieldErrorComponent,
    WattTextAreaFieldComponent,
  ],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <watt-modal
      [title]="t('modalTitle')"
      *transloco="let t; prefix: 'marketParticipant.accessToMeasurements'"
    >
      <form id="set-up-access-to-measurements-form" [formGroup]="form" (ngSubmit)="save()">
        <vater-stack fill="horizontal" justify="start">
          <watt-textarea-field
            [formControl]="form.controls.meteringPointIDs"
            [label]="t('meteringPointIDsLabel')"
            [required]="true"
          >
            <watt-field-hint>{{ t('meteringPointIDsHint') }}</watt-field-hint>

            @if (form.controls.meteringPointIDs.hasError('invalidMeteringPointIDs')) {
              <watt-field-error>{{ t('invalidMeteringPointIDs') }}</watt-field-error>
            }
          </watt-textarea-field>
        </vater-stack>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="closeModal(false)">{{ t('cancel') }}</watt-button>

        <watt-button
          type="submit"
          formId="set-up-access-to-measurements-form"
          [loading]="submitInProgress()"
        >
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhSetUpAccessToMeasurements extends WattTypedModal<DhMarketParticipantExtended> {
  private formBuilder = inject(NonNullableFormBuilder);
  private toastService = inject(WattToastService);

  private addMeteringPointsToAdditionalRecipient = mutation(
    AddMeteringPointsToAdditionalRecipientDocument
  );

  modal = viewChild.required(WattModalComponent);

  form = this.formBuilder.group({
    meteringPointIDs: new FormControl<string>('', [
      Validators.required,
      dhMeteringPointIDsValidator(),
    ]),
  });

  submitInProgress = this.addMeteringPointsToAdditionalRecipient.loading;

  closeModal(result: boolean) {
    this.modal().close(result);
  }

  save() {
    if (this.form.invalid || this.submitInProgress()) return;

    const { meteringPointIDs } = this.form.getRawValue();

    if (!meteringPointIDs) return;

    this.addMeteringPointsToAdditionalRecipient.mutate({
      variables: {
        input: {
          marketParticipantId: this.modalData.id,
          meteringPointIds: normalizeMeteringPointIDs(meteringPointIDs),
        },
      },
      refetchQueries: ({ data }) => {
        if (this.isUpdateSuccessful(data)) {
          return [
            GetAdditionalRecipientOfMeasurementsDocument,
            GetMarketParticipantAuditLogsDocument,
          ];
        }

        return [];
      },
      onCompleted: (result) => this.handleResponse(result),
    });
  }

  private handleResponse({
    addMeteringPointsToAdditionalRecipient,
  }: AddMeteringPointsToAdditionalRecipientMutation): void {
    if (
      addMeteringPointsToAdditionalRecipient?.errors &&
      addMeteringPointsToAdditionalRecipient?.errors.length > 0
    ) {
      this.toastService.open({
        type: 'danger',
        message: readApiErrorResponse(addMeteringPointsToAdditionalRecipient?.errors),
      });
    }

    if (addMeteringPointsToAdditionalRecipient.success) {
      this.toastService.open({
        type: 'success',
        message: translate('marketParticipant.accessToMeasurements.createSuccess'),
      });

      this.closeModal(true);
    }
  }

  private isUpdateSuccessful(
    mutationResult: MutationResult<AddMeteringPointsToAdditionalRecipientMutation>['data']
  ): boolean {
    return !!mutationResult?.addMeteringPointsToAdditionalRecipient.success;
  }
}
