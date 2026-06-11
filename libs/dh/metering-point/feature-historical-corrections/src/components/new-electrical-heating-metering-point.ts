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
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { WATT_RADIO } from '@energinet/watt/radio';
import { VATER } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { dayjs } from '@energinet/watt/core/date';

import {
  dhFormControlToSignal,
  dhMakeFormControl,
  dhMeteringPointIdValidator,
  injectRelativeNavigate,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  CreateElectricalHeatingMeteringPointDocument,
  GetRelatedMeteringPointsByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

@Component({
  selector: 'dh-new-electrical-heating-metering-point',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VATER,
    WATT_CARD,
    WATT_RADIO,
    WattButtonComponent,
    WattDatepickerComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    .metering-point-input {
      width: 50%;
    }

    watt-datepicker {
      width: auto;
    }
  `,
  template: `
    <vater-flex
      gap="ml"
      *transloco="
        let t;
        prefix: 'meteringPoint.historicalCorrection.newElectricalHeatingMeteringPoint'
      "
    >
      <watt-card>
        <form [formGroup]="form" (ngSubmit)="submit()" id="create-form" vater-stack align="start">
          <watt-text-field
            maxLength="18"
            [formControl]="form.controls.meteringPointId"
            [label]="t('childMeteringPointIdLabel')"
            class="metering-point-input"
          >
            @if (form.controls.meteringPointId.hasError('meteringPointIdLength')) {
              <watt-field-error>
                {{ t('error.meteringPointIdLength') }}
              </watt-field-error>
            }
          </watt-text-field>

          <watt-datepicker [label]="t('validityDate')" [formControl]="form.controls.validityDate" />

          <watt-datepicker
            [label]="t('closeDownDate')"
            [formControl]="form.controls.closeDownDate"
            [min]="closeDownDateMin()"
          />
        </form>
      </watt-card>

      <watt-button type="submit" formId="create-form">
        {{ t('create') }}
      </watt-button>
    </vater-flex>
  `,
})
export class DhNewElectricalHeatingMeteringPoint {
  private readonly navigate = injectRelativeNavigate();

  private create = mutation(CreateElectricalHeatingMeteringPointDocument, {
    onStatusUpdated: injectToast(
      'meteringPoint.historicalCorrection.newElectricalHeatingMeteringPoint.toast'
    ),
    onCompleted: () => this.navigate(['../']),
    refetchQueries: [GetRelatedMeteringPointsByIdDocument],
  });

  parentMeteringPointId = input.required<string>();

  form = new FormGroup({
    meteringPointId: dhMakeFormControl<string>('', [
      Validators.required,
      dhMeteringPointIdValidator(),
    ]),
    validityDate: dhMakeFormControl<Date | null>(null, Validators.required),
    closeDownDate: dhMakeFormControl<Date | null>(null),
  });

  private validityDateChanged = dhFormControlToSignal(this.form.controls.validityDate);

  closeDownDateMin = computed(() => {
    const validityDate = this.validityDateChanged();

    return validityDate ? dayjs(validityDate).toDate() : undefined;
  });

  async submit() {
    if (this.form.invalid) return;

    const { meteringPointId, validityDate, closeDownDate } = this.form.getRawValue();

    assertIsDefined(validityDate);

    await this.create.mutate({
      variables: {
        parentMeteringPointId: this.parentMeteringPointId(),
        childMeteringPointId: meteringPointId,
        validityDate,
        closeDownDate,
      },
    });
  }
}
