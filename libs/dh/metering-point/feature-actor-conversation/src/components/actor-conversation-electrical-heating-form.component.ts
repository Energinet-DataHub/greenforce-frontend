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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { skip } from 'rxjs';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattDatePipe } from '@energinet/watt/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';

import { ElectricalHeatingFormValue } from '../types';

export interface ElectricalHeatingSupplierPeriod {
  from: Date;
  to: Date;
}

export interface ElectricalHeatingInfo {
  customerName: string | null;
  supplierPeriods: ElectricalHeatingSupplierPeriod[];
  isElectricalHeatingActive: boolean;
  electricalHeatingFrom: Date | null;
}

@Component({
  selector: 'dh-actor-conversation-electrical-heating-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DhActorConversationElectricalHeatingFormComponent),
      multi: true,
    },
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    WattDatepickerComponent,
    WattCheckboxComponent,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
  ],
  template: `
    <vater-stack
      fill="horizontal"
      gap="m"
      *transloco="let t; prefix: 'meteringPoint.actorConversation.electricalHeatingForm'"
    >
      <h3>{{ t('title') }}</h3>

      @if (info(); as info) {
        <watt-description-list variant="stack" [itemSeparators]="false">
          <watt-description-list-item [label]="t('currentElectricalHeatingStatus')">
            {{ info.isElectricalHeatingActive ? t('yes') : t('no') }}
          </watt-description-list-item>
          <watt-description-list-item
            [label]="t('electricalHeatingDate')"
            [value]="info.electricalHeatingFrom | wattDate"
          />
          <watt-description-list-item [label]="t('customer')" [value]="info.customerName" />
          <watt-description-list-item [label]="t('supplierInPeriod')">
            @for (period of info.supplierPeriods; track period.from) {
              {{ period.from | wattDate }} — {{ period.to | wattDate }}
            }
          </watt-description-list-item>
        </watt-description-list>
      }

      <watt-datepicker
        [label]="t('addressEligibilityDate')"
        [formControl]="form.controls.addressEligibilityDate"
      />

      <vater-stack gap="s">
        <span class="watt-label">{{ t('periodTitle') }}</span>
        <vater-stack direction="row" gap="m">
          <watt-datepicker
            [label]="t('periodStart')"
            [formControl]="form.controls.periodStart"
          />
          <watt-datepicker
            [label]="t('periodEnd')"
            [formControl]="form.controls.periodEnd"
          />
        </vater-stack>
      </vater-stack>

      <vater-stack gap="s">
        <watt-checkbox [formControl]="form.controls.attachedBbrNotification">
          {{ t('attachedBbrNotification') }}
        </watt-checkbox>
        <watt-checkbox [formControl]="form.controls.attachedBbrDocumentation">
          {{ t('attachedBbrDocumentation') }}
        </watt-checkbox>
      </vater-stack>
    </vater-stack>
  `,
})
export class DhActorConversationElectricalHeatingFormComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  info = input<ElectricalHeatingInfo | null>(null);

  form = new FormGroup({
    addressEligibilityDate: new FormControl<Date | null>(null),
    periodStart: new FormControl<Date | null>(null),
    periodEnd: new FormControl<Date | null>(null),
    attachedBbrNotification: new FormControl<boolean>(false, { nonNullable: true }),
    attachedBbrDocumentation: new FormControl<boolean>(false, { nonNullable: true }),
  });

  value = toSignal(this.form.valueChanges);

  formValueChanged = toObservable(
    computed<ElectricalHeatingFormValue>(() => {
      const value = this.value();

      return {
        addressEligibilityDate: value?.addressEligibilityDate ?? null,
        periodStart: value?.periodStart ?? null,
        periodEnd: value?.periodEnd ?? null,
        attachedBbrNotification: value?.attachedBbrNotification ?? false,
        attachedBbrDocumentation: value?.attachedBbrDocumentation ?? false,
      };
    })
  );

  writeValue(value: ElectricalHeatingFormValue | null): void {
    if (value) {
      this.form.setValue(
        {
          addressEligibilityDate: value.addressEligibilityDate,
          periodStart: value.periodStart,
          periodEnd: value.periodEnd,
          attachedBbrNotification: value.attachedBbrNotification,
          attachedBbrDocumentation: value.attachedBbrDocumentation,
        },
        { emitEvent: false }
      );
    } else {
      this.form.reset(
        {
          addressEligibilityDate: null,
          periodStart: null,
          periodEnd: null,
          attachedBbrNotification: false,
          attachedBbrDocumentation: false,
        },
        { emitEvent: false }
      );
    }
    this.cdr.markForCheck();
  }

  registerOnChange = (fn: (value: ElectricalHeatingFormValue | null) => void) =>
    this.formValueChanged.subscribe(fn);

  registerOnTouched = (fn: () => void) =>
    this.form.valueChanges.pipe(skip(1)).subscribe(fn);

  setDisabledState = (disabled: boolean) =>
    disabled ? this.form.disable() : this.form.enable();
}

