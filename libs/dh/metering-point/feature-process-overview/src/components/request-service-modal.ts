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
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattToastService } from '@energinet/watt/toast';
import { VaterStackComponent } from '@energinet/watt/vater';

import {
  ServiceKindV1,
  RequestServiceEndOfSupplyDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhFormControlToSignal,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

export interface RequestServiceModalData {
  meteringPointId: string;
  processId: string;
}

const allowedServiceKinds = new Set<ServiceKindV1>([
  ServiceKindV1.OrdinaryDisconnectionAgreedWithTheCustomer,
  ServiceKindV1.ThePoliceIsInvolvedInTheDisconnection,
  ServiceKindV1.TheMunicipalityIsInvolvedInTheDisconnection,
  ServiceKindV1.TheBailiffsCourtIsInvolvedInTheDisconnection,
  ServiceKindV1.OtherReason,
]);

const excludedServiceKinds = Object.values(ServiceKindV1).filter(
  (kind) => !allowedServiceKinds.has(kind)
);

@Component({
  selector: 'dh-request-service-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattTextAreaFieldComponent,
    WattDatepickerComponent,
    VaterStackComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    watt-textarea-field {
      --watt-textarea-max-height: 200px;
    }

    .character-count {
      text-align: right;
      color: var(--watt-on-light--low-emphasis);
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.processOverview.requestService'"
      [title]="t('title')"
      size="small"
    >
      <form id="request-service-form" [formGroup]="form" (ngSubmit)="submit()">
        <vater-stack direction="column" gap="m">
          <watt-dropdown
            dhDropdownTranslator
            translateKey="meteringPoint.processOverview.requestService.serviceKinds"
            [label]="t('serviceKindLabel')"
            [placeholder]="t('serviceKindPlaceholder')"
            [formControl]="form.controls.serviceKind"
            [options]="serviceKindOptions"
            [showResetOption]="false"
          />

          <watt-datepicker [label]="t('startDateLabel')" [formControl]="form.controls.startDate" />

          <div>
            <watt-textarea-field
              [label]="t('descriptionLabel')"
              [formControl]="form.controls.description"
              [maxLength]="maxDescriptionLength"
            />
            <p class="watt-text-s character-count">
              {{ (description() ?? '').length }} / {{ maxDescriptionLength }}
            </p>
          </div>
        </vater-stack>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="request-service-form" [loading]="loading()">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhRequestServiceModal extends WattTypedModal<RequestServiceModalData> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly requestServiceMutation = mutation(RequestServiceEndOfSupplyDocument);

  readonly modal = viewChild.required(WattModalComponent);
  readonly loading = this.requestServiceMutation.loading;
  readonly maxDescriptionLength = 1000;
  readonly serviceKindOptions = dhEnumToWattDropdownOptions(ServiceKindV1, excludedServiceKinds);

  readonly form = this.fb.group({
    serviceKind: this.fb.control<ServiceKindV1 | null>(null, Validators.required),
    startDate: this.fb.control<Date | null>(null, Validators.required),
    description: this.fb.control<string | null>(null, Validators.maxLength(this.maxDescriptionLength)),
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
        processId: this.modalData.processId,
        serviceKind,
        startDate,
        description: description || null,
      },
      onError: () => {
        this.modal().close(false);
        this.toastService.open({
          type: 'danger',
          message: translate('meteringPoint.processOverview.requestService.errorToast'),
        });
      },
      onCompleted: () => {
        this.modal().close(true);
        this.toastService.open({
          type: 'success',
          message: translate('meteringPoint.processOverview.requestService.successToast'),
        });
      },
    });
  }
}
