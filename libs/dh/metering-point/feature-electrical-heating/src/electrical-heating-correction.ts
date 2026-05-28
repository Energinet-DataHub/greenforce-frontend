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
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VATER } from '@energinet/watt/vater';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

import { combineWithIdPaths } from '@energinet-datahub/dh/core/configuration-routing';
import {
  dhMakeFormControl,
  dhMeteringPointIdValidator,
} from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-electrical-heating-correction',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    RouterLink,
    WattTextFieldComponent,
    VATER,
    WattButtonComponent,
    WATT_CARD,
  ],
  styles: `
    :host {
      display: block;
      width: 800px;
    }

    .register-electrical-heating-title {
      color: var(--watt-color-primary);
    }

    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <form
      *transloco="let t; prefix: 'meteringPoint.electricalHeatingCorrection'"
      [formGroup]="form"
      (ngSubmit)="submit()"
    >
      <vater-stack direction="row" justify="space-between" class="watt-space-stack-ml">
        <h1 class="no-margin">{{ t('title') }}</h1>

        <watt-button [routerLink]="cancelLink()" variant="secondary"
          >{{ t('cancel') }}
        </watt-button>
      </vater-stack>

      <vater-flex gap="ml">
        <watt-card>
          <h3 class="no-margin">{{ t('title') }}</h3>
          <h2 class="no-margin register-electrical-heating-title">
            {{ t('registerElectricalHeating') }}
          </h2>
        </watt-card>

        <watt-card>
          <p>{{ t('meteringPoint') }}</p>

          <vater-stack direction="row" gap="s" align="center" fill="horizontal">
            <watt-text-field
              maxLength="18"
              [formControl]="form.controls.meteringPointId"
              [label]="t('meteringPointIdLabel')"
            />
          </vater-stack>
        </watt-card>

        <watt-button type="submit">{{ t('registerElectricalHeating') }}</watt-button>
      </vater-flex>
    </form>
  `,
})
export class DhElectricalHeatingCorrection {
  internalMeteringPointId = input.required<string>();

  form = new FormGroup({
    meteringPointId: dhMakeFormControl<string>('', [
      Validators.required,
      dhMeteringPointIdValidator(),
    ]),
  });

  cancelLink = computed(() =>
    combineWithIdPaths('metering-point', this.internalMeteringPointId(), 'actor-conversation')
  );

  submit() {
    console.log('submit', this.form.value);
  }
}
