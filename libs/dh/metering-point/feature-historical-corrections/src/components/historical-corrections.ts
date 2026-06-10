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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { WATT_RADIO } from '@energinet/watt/radio';
import { VATER } from '@energinet/watt/vater';

import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-historical-corrections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VATER,
    WATT_CARD,
    WATT_RADIO,
    WattButtonComponent,
  ],
  styles: `
    :host {
      display: block;
      width: 800px;
    }

    .selected-correction-title {
      color: var(--watt-color-primary);
    }

    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPoint.historicalCorrection'">
      <vater-stack direction="row" justify="space-between" class="watt-space-stack-ml">
        <h1 class="no-margin">{{ t('title') }}</h1>

        <watt-button variant="secondary">{{ t('cancel') }}</watt-button>
      </vater-stack>

      <vater-flex gap="ml">
        <form #form="ngForm" id="historicalCorrectionForm" [formGroup]="historicalCorrectionForm">
          @let isSubmitted = form.submitted;

          <watt-card>
            @if (isSubmitted && form.valid) {
              <vater-stack direction="row" justify="space-between">
                <vater-flex direction="column">
                  <h3 class="no-margin">{{ t('title') }}</h3>

                  <h2 class="no-margin selected-correction-title">
                    {{ t(historicalCorrectionForm.controls.type.value) }}
                  </h2>
                </vater-flex>

                <watt-button variant="text" (click)="form.resetForm()">
                  {{ t('editBtn') }}
                </watt-button>
              </vater-stack>
            } @else {
              <h3 class="watt-space-stack-m">
                {{ t('correctionToChooseFrom') }}
              </h3>

              <watt-radio-group [formControl]="historicalCorrectionForm.controls.type">
                <watt-radio [value]="'newElectricalHeatingMP'">
                  {{ t('newElectricalHeatingMP') }}
                </watt-radio>
              </watt-radio-group>
            }
          </watt-card>
        </form>

        @if (form.invalid) {
          <watt-button type="submit" formId="historicalCorrectionForm">
            {{ t('continueToDetails') }}
          </watt-button>
        }
      </vater-flex>
    </ng-container>
  `,
})
export class DhHistoricalCorrections {
  historicalCorrectionForm = new FormGroup(
    {
      type: dhMakeFormControl<string>('', Validators.required),
    },
    { updateOn: 'submit' }
  );
}
