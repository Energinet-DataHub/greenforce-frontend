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
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { skip } from 'rxjs';

import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';
import { WattDatePipe, wattFormatDate } from '@energinet/watt/date';
import { ElectricalHeatingFormValue } from '../types';
import { ElectricalHeatingInformation } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

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
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDatePipe,
    VaterFlexComponent,
  ],
  styles: `
    h3 {
      margin: 0;
    }

    watt-datepicker {
      width: auto;
    }

    .supplier-period {
      display: block;
    }
  `,
  template: `
    <vater-stack
      gap="s"
      *transloco="let t; prefix: 'meteringPoint.actorConversation.electricalHeatingForm'"
      align="start"
    >
      <h3>{{ t('title') }}</h3>

      <watt-description-list variant="compact">
        <watt-description-list-item
          [label]="t('currentElectricalHeatingStatus')"
          [value]="t(electricalHeatingInformation()?.isElectricalHeatingActive ? 'yes' : 'no')"
        />
        <watt-description-list-item
          [label]="t('electricalHeatingDate')"
          [value]="electricalHeatingInformation()?.electricalHeatingFrom | wattDate"
        />
        <watt-description-list-item
          [label]="t('customer')"
          [value]="electricalHeatingInformation()?.customerName"
        />
        @if (supplierPeriods().length > 0) {
          <watt-description-list-item [label]="t('supplierInPeriod')">
            @for (period of supplierPeriods(); track $index) {
              <span class="supplier-period">{{ period }}</span>
            }
          </watt-description-list-item>
        }
      </watt-description-list>

      <watt-datepicker
        [label]="t('addressEligibilityDate')"
        [formControl]="form.controls.addressEligibilityDate"
      />

      <span class="watt-label">{{ t('periodTitle') }}</span>
      <vater-flex direction="row" gap="m">
        <watt-datepicker [label]="t('periodStart')" [formControl]="form.controls.periodStart" />
        <watt-datepicker [label]="t('periodEnd')" [formControl]="form.controls.periodEnd" />
      </vater-flex>

      <vater-stack gap="s" align="start">
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
  electricalHeatingInformation = input<ElectricalHeatingInformation>();
  supplierPeriods = computed(() => {
    const periods = this.electricalHeatingInformation()?.supplierPeriods;
    if (!periods || periods.length === 0) return [];
    const now = new Date();
    return periods.map((p) => {
      const to = p.to && new Date(p.to) <= now ? p.to : null;
      return wattFormatDate({ start: p.from, end: to }) ?? '';
    });
  });
  form = new FormGroup({
    addressEligibilityDate: dhMakeFormControl<Date | null>(null, Validators.required),
    periodStart: dhMakeFormControl<Date | null>(null, Validators.required),
    periodEnd: dhMakeFormControl<Date | null>(null),
    attachedBbrNotification: dhMakeFormControl<boolean>(false),
    attachedBbrDocumentation: dhMakeFormControl<boolean>(false),
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

  // Implementation for ControlValueAccessor
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
  registerOnTouched = (fn: () => void) => this.form.valueChanges.pipe(skip(1)).subscribe(fn);
  setDisabledState = (disabled: boolean) => (disabled ? this.form.disable() : this.form.enable());
}
