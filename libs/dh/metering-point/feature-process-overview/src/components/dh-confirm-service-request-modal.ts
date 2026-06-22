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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/date';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattToastService } from '@energinet/watt/toast';
import { VaterStackComponent } from '@energinet/watt/vater';

import {
  ConfirmServiceRequestDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

export interface DhConfirmServiceRequestModalData {
  meteringPointId: string;
  processId: string;
  startDate: Date;
}

@Component({
  selector: 'dh-confirm-service-request-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattDatePipe,
    WattTextAreaFieldComponent,
    VaterStackComponent,
  ],
  styles: `
    watt-textarea-field {
      --watt-textarea-max-height: 200px;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.processOverview.confirmServiceRequest'"
      [title]="t('title')"
      size="small"
    >
      <form id="confirm-service-request-form" [formGroup]="form" (ngSubmit)="submit()">
        <vater-stack direction="column" align="start" gap="m">
          <!-- Placeholder until serviceKind is surfaced on the process (PM follow-up) -->
          <div>
            <p class="watt-label">{{ t('serviceKindLabel') }}</p>
            <p class="watt-text-s">{{ t('serviceKindPlaceholder') }}</p>
          </div>

          <div>
            <p class="watt-label">{{ t('startDateLabel') }}</p>
            <p class="watt-text-s">{{ modalData.startDate | wattDate }}</p>
          </div>

          <watt-textarea-field
            [label]="t('descriptionLabel')"
            [formControl]="form.controls.description"
          />
        </vater-stack>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="confirm-service-request-form" [loading]="loading()">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhConfirmServiceRequestModal extends WattTypedModal<DhConfirmServiceRequestModalData> {
  private readonly toastService = inject(WattToastService);
  private readonly confirmServiceRequestMutation = mutation(ConfirmServiceRequestDocument);

  readonly modal = viewChild.required(WattModalComponent);
  readonly loading = this.confirmServiceRequestMutation.loading;

  readonly form = new FormGroup({
    description: dhMakeFormControl<string | null>(null),
  });

  async submit() {
    if (this.form.invalid) return;

    const { description } = this.form.getRawValue();

    await this.confirmServiceRequestMutation.mutate({
      refetchQueries: [
        GetMeteringPointProcessByIdDocument,
        GetMeteringPointProcessOverviewDocument,
      ],
      variables: {
        meteringPointId: this.modalData.meteringPointId,
        processId: this.modalData.processId,
        description: description || null,
      },
      onError: () => {
        this.modal().close(false);
        this.toastService.open({
          type: 'danger',
          message: translate('meteringPoint.processOverview.confirmServiceRequest.errorToast'),
        });
      },
      onCompleted: () => {
        this.modal().close(true);
        this.toastService.open({
          type: 'success',
          message: translate('meteringPoint.processOverview.confirmServiceRequest.successToast'),
        });
      },
    });
  }
}
