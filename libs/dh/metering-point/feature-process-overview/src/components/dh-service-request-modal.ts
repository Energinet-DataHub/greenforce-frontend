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
import { Router } from '@angular/router';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { dayjs } from '@energinet/watt/date';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattFieldHintComponent } from '@energinet/watt/field';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattToastService } from '@energinet/watt/toast';
import { VaterStackComponent } from '@energinet/watt/vater';

import {
  BasePaths,
  getPath,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';
import {
  ServiceKindV1,
  RequestServiceServiceRequestDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhFormControlToSignal,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

export interface DhServiceRequestModalData {
  meteringPointId: string;
  internalMeteringPointId: string;
}

const allowedServiceKinds = new Set<ServiceKindV1>([
  ServiceKindV1.Disconnect,
  ServiceKindV1.Connect,
  ServiceKindV1.MeterCheck,
]);

const excludedServiceKinds = Object.values(ServiceKindV1).filter(
  (kind) => !allowedServiceKinds.has(kind)
);

@Component({
  selector: 'dh-service-request-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattFieldHintComponent,
    WattTextAreaFieldComponent,
    WattDatepickerComponent,
    VaterStackComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    form {
      margin-top: var(--watt-space-l);
    }

    watt-textarea-field {
      --watt-textarea-max-height: 200px;
    }

    .field {
      width: 320px;
    }

    .character-count {
      display: block;
      text-align: right;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.processOverview.serviceRequest'"
      [title]="t('title')"
      size="small"
    >
      <form id="service-request-form" [formGroup]="form" (ngSubmit)="submit()">
        <vater-stack direction="column" align="start">
          <watt-dropdown
            class="field"
            dhDropdownTranslator
            translateKey="meteringPoint.processOverview.serviceRequest.serviceKinds"
            [label]="t('serviceKindLabel')"
            [placeholder]="t('serviceKindPlaceholder')"
            [formControl]="form.controls.serviceKind"
            [options]="serviceKindOptions"
            [showResetOption]="false"
          />

          <watt-datepicker
            class="field"
            [label]="t('startDateLabel')"
            [formControl]="form.controls.startDate"
            [max]="maxDate"
          />

          <watt-textarea-field
            class="field"
            [label]="t('descriptionLabel')"
            [formControl]="form.controls.description"
            [maxLength]="maxDescriptionLength"
          >
            <watt-field-hint class="character-count">
              {{ (description() ?? '').length }} / {{ maxDescriptionLength }}
            </watt-field-hint>
          </watt-textarea-field>
        </vater-stack>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="service-request-form" [loading]="loading()">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhServiceRequestModal extends WattTypedModal<DhServiceRequestModalData> {
  private readonly toastService = inject(WattToastService);
  private readonly router = inject(Router);
  private readonly requestServiceMutation = mutation(RequestServiceServiceRequestDocument);

  readonly modal = viewChild.required(WattModalComponent);
  readonly loading = this.requestServiceMutation.loading;
  readonly maxDescriptionLength = 1000;
  readonly serviceKindOptions = dhEnumToWattDropdownOptions(ServiceKindV1, excludedServiceKinds);
  readonly maxDate = dayjs().startOf('day').add(60, 'day').toDate();

  readonly form = new FormGroup({
    serviceKind: dhMakeFormControl<ServiceKindV1 | null>(null, Validators.required),
    startDate: dhMakeFormControl<Date | null>(null, Validators.required),
    description: dhMakeFormControl<string | null>(
      null,
      Validators.maxLength(this.maxDescriptionLength)
    ),
  });

  readonly description = dhFormControlToSignal(this.form.controls.description);

  async submit() {
    if (this.form.invalid) return;

    const { serviceKind, startDate, description } = this.form.getRawValue();
    if (!serviceKind || !startDate) return;

    await this.requestServiceMutation.mutate({
      refetchQueries: [
        GetMeteringPointProcessByIdDocument,
        GetMeteringPointProcessOverviewDocument,
      ],
      variables: {
        meteringPointId: this.modalData.meteringPointId,
        serviceKind,
        startDate,
        description: description || null,
      },
      onError: () => {
        this.modal().close(false);
        this.toastService.open({
          type: 'danger',
          message: translate('meteringPoint.processOverview.serviceRequest.errorToast'),
        });
      },
      onCompleted: () => {
        this.modal().close(true);
        this.toastService.open({
          type: 'success',
          message: translate('meteringPoint.processOverview.serviceRequest.successToast'),
          actionLabel: translate('meteringPoint.processOverview.serviceRequest.successToastAction'),
          action: (ref) => {
            this.router.navigate([
              getPath<BasePaths>('metering-point'),
              this.modalData.internalMeteringPointId,
              getPath<MeteringPointSubPaths>('process-overview'),
            ]);
            ref.dismiss();
          },
        });
      },
    });
  }
}
