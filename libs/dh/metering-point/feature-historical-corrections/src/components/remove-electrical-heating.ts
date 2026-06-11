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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VATER } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import {
  dhMakeFormControl,
  injectRelativeNavigate,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { RemoveElectricalHeatingMeteringPointDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-remove-electrical-heating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VATER,
    WATT_CARD,
    WattButtonComponent,
    WattDatepickerComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    watt-datepicker {
      width: auto;
    }
  `,
  template: `
    <vater-flex
      gap="ml"
      *transloco="let t; prefix: 'meteringPoint.historicalCorrection.removeElectricalHeating'"
    >
      <watt-card>
        <form [formGroup]="form" (ngSubmit)="submit()" id="remove-form" vater-stack align="start">
          <watt-datepicker [label]="t('cutOffDate')" [formControl]="form.controls.cutOffDate" />
        </form>
      </watt-card>

      <watt-button type="submit" formId="remove-form">
        {{ t('remove') }}
      </watt-button>
    </vater-flex>
  `,
})
export class DhRemoveElectricalHeating {
  private readonly navigate = injectRelativeNavigate();

  private remove = mutation(RemoveElectricalHeatingMeteringPointDocument, {
    onStatusUpdated: injectToast(
      'meteringPoint.historicalCorrection.removeElectricalHeating.toast'
    ),
    onCompleted: () => this.navigate(['../']),
  });

  parentMeteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();

  form = new FormGroup({
    cutOffDate: dhMakeFormControl<Date | null>(null, Validators.required),
  });

  async submit() {
    if (this.form.invalid) return;

    const { cutOffDate } = this.form.getRawValue();

    assertIsDefined(cutOffDate);

    await this.remove.mutate({
      variables: {
        parentMeteringPointId: this.parentMeteringPointId(),
        searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
        cutOffDate,
      },
    });
  }
}
