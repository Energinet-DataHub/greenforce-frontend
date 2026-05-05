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
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattRadioComponent } from '@energinet/watt/radio';
import { WattToastService } from '@energinet/watt/toast';
import { VaterStackComponent } from '@energinet/watt/vater';

import {
  BasePaths,
  getPath,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';
import {
  InitiateChangeOfSupplierDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-change-of-supplier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    WattCheckboxComponent,
    WattTextFieldComponent,
    WattRadioComponent,
    VaterStackComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    .cut-off-date-field {
      max-width: 150px;
    }

    .cpr-field {
      max-width: 110px;
    }

    .cvr-field {
      max-width: 90px;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.changeOfSupplier'"
      [title]="t('modalTitle')"
      size="small"
    >
      <form id="change-of-supplier-form" [formGroup]="form" (ngSubmit)="submit()">
        <vater-stack direction="column" gap="m" align="start">
          <watt-datepicker
            [label]="t('cutOffDate')"
            [formControl]="form.controls.cutOffDate"
            class="cut-off-date-field"
          />

          <vater-stack align="start" gap="s">
            <span class="watt-label">{{ t('customerInformation') }}</span>

            <vater-stack direction="row" gap="m">
              <watt-radio
                group="customer-type"
                [formControl]="form.controls.customerType"
                value="private"
                >{{ t('private') }}</watt-radio
              >
              <watt-radio
                group="customer-type"
                [formControl]="form.controls.customerType"
                value="business"
                >{{ t('business') }}</watt-radio
              >
            </vater-stack>
          </vater-stack>

          @if (form.controls.customerType.value === 'private') {
            <watt-text-field
              [label]="t('cpr')"
              [formControl]="form.controls.cpr"
              maxLength="10"
              class="cpr-field"
            />
          } @else {
            <watt-text-field
              [label]="t('cvr')"
              [formControl]="form.controls.cvr"
              maxLength="8"
              class="cvr-field"
            />
          }

          <watt-checkbox [formControl]="form.controls.protectedNameAndAddress">
            {{ t('protectedNameAndAddress') }}
          </watt-checkbox>
        </vater-stack>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="change-of-supplier-form" [loading]="loading()">
          {{ t('submit') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhChangeOfSupplierComponent extends WattTypedModal<{
  meteringPointId: string;
  internalMeteringPointId: string;
}> {
  private readonly router = inject(Router);
  private readonly toastService = inject(WattToastService);
  private readonly initiateChangeOfSupplier = mutation(InitiateChangeOfSupplierDocument);

  readonly modal = viewChild.required(WattModalComponent);
  readonly loading = this.initiateChangeOfSupplier.loading;

  readonly form = new FormGroup({
    cutOffDate: dhMakeFormControl<Date>(null, Validators.required),
    customerType: dhMakeFormControl<'private' | 'business'>('private'),
    cpr: dhMakeFormControl<string>('', Validators.required),
    cvr: dhMakeFormControl<string>(''),
    protectedNameAndAddress: dhMakeFormControl<boolean>(false),
  });

  private readonly customerTypeChanged = toSignal(this.form.controls.customerType.valueChanges, {
    initialValue: 'private' as const,
  });

  private readonly customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType === 'private') {
      this.form.controls.cpr.enable();
      this.form.controls.cpr.setValidators(Validators.required);
      this.form.controls.cvr.disable();
      this.form.controls.cvr.clearValidators();
    } else {
      this.form.controls.cvr.enable();
      this.form.controls.cvr.setValidators(Validators.required);
      this.form.controls.cpr.disable();
      this.form.controls.cpr.clearValidators();
    }

    this.form.controls.cpr.updateValueAndValidity();
    this.form.controls.cvr.updateValueAndValidity();
  });

  async submit() {
    if (this.form.invalid || this.initiateChangeOfSupplier.loading()) return;

    const { cutOffDate, customerType, cpr, cvr, protectedNameAndAddress } = this.form.getRawValue();

    if (!cutOffDate) return;

    await this.initiateChangeOfSupplier.mutate({
      variables: {
        input: {
          meteringPointId: this.modalData.meteringPointId,
          startDate: cutOffDate,
          customerType,
          cpr: customerType === 'private' ? cpr : null,
          cvr: customerType === 'business' ? cvr : null,
          protectedNameAndAddress: protectedNameAndAddress ?? false,
        },
      },
      onError: () => {
        this.modal().close(false);
        this.toastService.open({
          type: 'danger',
          message: translate('meteringPoint.changeOfSupplier.submitError'),
        });
      },
      onCompleted: () => {
        this.modal().close(true);
        this.toastService.open({
          type: 'success',
          message: translate('meteringPoint.changeOfSupplier.submitSuccess'),
          actionLabel: translate('meteringPoint.changeOfSupplier.submitSuccessAction'),
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
