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
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattRadioComponent } from '@energinet/watt/radio';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

import { dhMeteringPointTypeParam } from './dh-metering-point-params';

@Component({
  selector: 'dh-create-metering-point',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
    VaterSpacerComponent,
    WATT_CARD,
    WattButtonComponent,
    WattTextFieldComponent,
    WattRadioComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
  ],
  styles: `
    :host {
      display: block;
      padding: var(--watt-space-ml);
    }

    .page-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--watt-space-m);
    }
  `,
  templateUrl: './dh-create-metering-point.component.html',
})
export class DhCreateMeteringPoint {
  readonly mpType = inject(ActivatedRoute)?.snapshot.queryParamMap.get(dhMeteringPointTypeParam);

  today = new Date();

  form = new FormGroup({
    details: new FormGroup({
      validityDate: dhMakeFormControl<Date | null>(this.today, Validators.required),
      meteringPointId: dhMakeFormControl('', Validators.required),
      subType: dhMakeFormControl('', Validators.required),
      powerLimitKw: dhMakeFormControl(''),
      powerLimitAmpere: dhMakeFormControl(''),
      disconnectionType: dhMakeFormControl('', Validators.required),
      gridArea: dhMakeFormControl('', Validators.required),
    }),
  });

  save() {
    console.log('Saving metering point', this.form.value);
  }
}
