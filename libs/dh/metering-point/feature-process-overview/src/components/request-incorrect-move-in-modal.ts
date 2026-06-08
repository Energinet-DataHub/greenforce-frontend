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
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/date';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattToastService } from '@energinet/watt/toast';
import { VaterStackComponent } from '@energinet/watt/vater';

import {
  RequestIncorrectMoveInDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

export interface RequestIncorrectMoveInModalData {
  meteringPointId: string;
  processId: string;
  cutoffDate: Date;
}

@Component({
  selector: 'dh-request-incorrect-move-in-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattCheckboxComponent,
    WattTextAreaFieldComponent,
    VaterStackComponent,
    WattDatePipe,
  ],
  styles: `
    p {
      margin: 0 0 var(--watt-space-sm) 0;
    }

    watt-textarea-field {
      --watt-textarea-min-height: 80px;
    }

    .ng-submitted.ng-invalid a {
      color: var(--watt-color-state-danger);
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.processOverview.incorrectMoveIn'"
      [title]="t('title')"
      size="small"
    >
      <form id="request-incorrect-move-in-form" [formGroup]="form" (ngSubmit)="submit()">
        <vater-stack direction="column" align="start" gap="xs">
          <p>
            <small>{{ t('description', { cutoffDate: modalData.cutoffDate | wattDate }) }}</small>
          </p>

          <watt-textarea-field
            [label]="t('reasonLabel')"
            [formControl]="form.controls.reason"
            [maxLength]="maxReasonLength"
          />

          <watt-checkbox [formControl]="form.controls.termsAndConditions">
            <small>
              <a
                href="https://energinet.dk/regler/el/elmarked/"
                target="_blank"
                rel="noopener noreferrer"
                >{{ t('conditionsPrefix') }}</a
              >
              {{ t('conditionsSuffix') }}
            </small>
          </watt-checkbox>
        </vater-stack>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="request-incorrect-move-in-form" [loading]="loading()">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhRequestIncorrectMoveInModal extends WattTypedModal<RequestIncorrectMoveInModalData> {
  private readonly toastService = inject(WattToastService);
  private readonly requestIncorrectMoveInMutation = mutation(RequestIncorrectMoveInDocument);

  readonly modal = viewChild.required(WattModalComponent);
  readonly loading = this.requestIncorrectMoveInMutation.loading;
  readonly maxReasonLength = 500;

  readonly form = new FormGroup({
    reason: dhMakeFormControl<string | null>(null, Validators.maxLength(this.maxReasonLength)),
    termsAndConditions: dhMakeFormControl(false, Validators.requiredTrue),
  });

  async submit() {
    if (this.form.invalid) return;

    const { reason } = this.form.getRawValue();

    await this.requestIncorrectMoveInMutation.mutate({
      refetchQueries: [
        GetMeteringPointProcessByIdDocument,
        GetMeteringPointProcessOverviewDocument,
      ],
      variables: {
        processId: this.modalData.processId,
        meteringPointId: this.modalData.meteringPointId,
        cutoffDate: this.modalData.cutoffDate,
        reason,
      },
      onError: () => {
        this.modal().close(false);
        this.toastService.open({
          type: 'danger',
          message: translate('meteringPoint.processOverview.incorrectMoveIn.errorToast'),
        });
      },
      onCompleted: () => {
        this.modal().close(true);
        this.toastService.open({
          type: 'success',
          message: translate('meteringPoint.processOverview.incorrectMoveIn.successToast'),
        });
      },
    });
  }
}
