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
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattDateTimeField } from '@energinet-datahub/watt/datetime-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattDateTimeField,
    WattFieldErrorComponent,
    WattRadioComponent,
    VaterFlexComponent,
    VaterStackComponent,
  ],
  selector: 'dh-calculations-schedule-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .scheduled {
      min-width: max-content;
      min-height: 66px;
      margin-top: var(--watt-space-s);
    }
  `,
  template: `
    <vater-flex gap="s" *transloco="let t; read: 'wholesale.calculations.create.scheduledAt'">
      <label>{{ t('label') }}</label>
      <watt-radio
        group="scheduled"
        [formControl]="radio"
        [value]="false"
        data-testid="calculateNow"
      >
        {{ t('now') }}
      </watt-radio>
      <vater-stack direction="row" gap="ml" align="flex-start">
        <watt-radio
          group="scheduled"
          class="scheduled"
          [formControl]="radio"
          [value]="true"
          data-testid="scheduleCalculation"
        >
          {{ t('schedule') }}
        </watt-radio>
        @if (radio.value) {
          <watt-datetime-field
            [min]="minScheduledAt"
            [formControl]="datetime()"
            data-testid="scheduleCalculation.date"
          >
            @if (datetime().errors?.past) {
              <watt-field-error>
                {{ t('past') }}
              </watt-field-error>
            }
          </watt-datetime-field>
        }
      </vater-stack>
    </vater-flex>
  `,
})
export class DhCalculationsScheduleField {
  datetime = input.required<FormControl<Date | null>>();
  radio = new FormControl(false, { nonNullable: true });
  scheduled = toSignal(this.radio.valueChanges);
  minScheduledAt = new Date();

  constructor() {
    effect(() => {
      const datetime = this.datetime();
      const scheduled = this.scheduled();
      datetime.reset();
      datetime.setValidators((control) => {
        if (!scheduled) return null;
        if (control.value && control.value < new Date()) return { past: true };
        return control.value ? null : { required: true };
      });
    });
  }
}
