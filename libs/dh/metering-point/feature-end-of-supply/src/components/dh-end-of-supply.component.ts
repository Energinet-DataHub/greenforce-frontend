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
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattFieldHintComponent } from '@energinet/watt/field';
import { WattToastService } from '@energinet/watt/toast';

import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';

@Component({
  selector: 'dh-end-of-supply',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    WattCheckboxComponent,
    WattFieldHintComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    .consequences-info {
      margin: var(--watt-space-m) 0;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.endOfSupply'"
      [title]="t('modalTitle')"
      size="small"
    >
      <form [formGroup]="form">
        <watt-datepicker
          [label]="t('dateLabel')"
          [min]="minDate"
          [max]="maxDate"
          [formControl]="form.controls.cutOffDate"
        >
          <watt-field-hint>{{ t('dateHint') }}</watt-field-hint>
        </watt-datepicker>

        <p class="consequences-info">{{ t('consequencesInfo') }}</p>

        <watt-checkbox [formControl]="form.controls.confirm">
          {{ t('confirmCheckbox') }}
        </watt-checkbox>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button (click)="submit()">
          {{ t('submit') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhEndOfSupplyComponent extends WattTypedModal<{ meteringPointId: string }> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);

  readonly modal = viewChild.required(WattModalComponent);

  readonly minDate = this.addDays(new Date(), 3);
  readonly maxDate = this.addDays(new Date(), 60);

  readonly form = this.fb.group({
    cutOffDate: this.fb.control<Date | null>(null, Validators.required),
    confirm: this.fb.control<boolean>(false, Validators.requiredTrue),
  });

  submit() {
    this.form.markAllAsTouched();
    this.form.controls.confirm.markAsDirty();

    if (this.form.invalid) return;

    this.toastService.open({
      type: 'success',
      message: this.transloco.translate('meteringPoint.endOfSupply.submitSuccess'),
      actionLabel: this.transloco.translate('meteringPoint.endOfSupply.submitSuccessAction'),
      action: (ref) => {
        this.router.navigate([
          getPath<BasePaths>('metering-point'),
          this.modalData.meteringPointId,
          getPath<MeteringPointSubPaths>('process-overview'),
        ]);
        ref.dismiss();
      },
    });

    this.modal().close(true);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
