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
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet/watt/vater';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattRadioComponent } from '@energinet/watt/radio';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { dayjs } from '@energinet/watt/date';

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
    VaterFlexComponent,
    WATT_CARD,
    WattButtonComponent,
    WattTextFieldComponent,
    WattRadioComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattTextAreaFieldComponent,
  ],
  styles: `
    :host {
      display: block;
      padding: var(--watt-space-ml);
    }

    .page-grid {
      align-items: flex-start;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--watt-space-m);
    }

    .country-dropdown {
      width: 200px;
    }

    watt-textarea-field {
      --watt-textarea-min-height: 100px;
    }

    .is-required::after {
      content: '*';
      color: var(--watt-color-primary);
      margin-left: var(--watt-space-s);
    }
  `,
  templateUrl: './dh-create-metering-point.component.html',
})
export class DhCreateMeteringPoint {
  readonly mpType = inject(ActivatedRoute)?.snapshot.queryParamMap.get(dhMeteringPointTypeParam);

  today = dayjs().startOf('day').toDate();
  yesterday = dayjs(this.today).subtract(1, 'day').startOf('day').toDate();

  form = new FormGroup({
    details: new FormGroup({
      validityDate: dhMakeFormControl<Date | null>(this.today, Validators.required),
      meteringPointId: dhMakeFormControl('', Validators.required),
      subType: dhMakeFormControl('physical', Validators.required),
      meteringPointNumber: dhMakeFormControl('', Validators.required),
      powerLimitKw: dhMakeFormControl(''),
      powerLimitAmpere: dhMakeFormControl(''),
      disconnectionType: dhMakeFormControl('D01', Validators.required),
      gridArea: dhMakeFormControl('', Validators.required),
    }),
    address: new FormGroup({
      countryCode: dhMakeFormControl('', Validators.required),
      washInstructions: dhMakeFormControl('WASHABLE', Validators.required),
      streetName: dhMakeFormControl('', Validators.required),
      buildingNumber: dhMakeFormControl('', Validators.required),
      floor: dhMakeFormControl(''),
      room: dhMakeFormControl(''),
      postCode: dhMakeFormControl('', Validators.required),
      cityName: dhMakeFormControl('', Validators.required),
      citySubDivisionName: dhMakeFormControl(''),
      streetCode: dhMakeFormControl('', Validators.required),
      municipalityCode: dhMakeFormControl('', Validators.required),
      darID: dhMakeFormControl('', Validators.required),
      comment: dhMakeFormControl(''),
    }),
    powerPlant: new FormGroup({
      netSettlementGroup: dhMakeFormControl('0', Validators.required),
      capacity: dhMakeFormControl('', Validators.required),
      gsrnNumber: dhMakeFormControl('', Validators.required),
      connectionType: dhMakeFormControl('D01', Validators.required),
      assetType: dhMakeFormControl('', Validators.required),
    }),
    other: new FormGroup({
      resolution: dhMakeFormControl('quarterHourly', Validators.required),
      measureUnit: dhMakeFormControl('K_WH', Validators.required),
      product: dhMakeFormControl('ENERGY_ACTIVE', Validators.required),
    }),
  });

  subTypeChanged = toSignal(this.form.controls.details.controls.subType.valueChanges);

  subTypeEffect = effect(() => {
    const subType = this.subTypeChanged();

    if (subType === undefined) return;

    if (subType !== 'physical') {
      this.form.controls.details.controls.meteringPointNumber.reset();
    }
  });

  netSettlementGroupChanged = toSignal(
    this.form.controls.powerPlant.controls.netSettlementGroup.valueChanges
  );

  netSettlementGroupEffect = effect(() => {
    const netSettlementGroup = this.netSettlementGroupChanged();

    if (netSettlementGroup === undefined) return;

    if (netSettlementGroup === '0') {
      const powerPlantControls = this.form.controls.powerPlant.controls;

      powerPlantControls.capacity.reset();
      powerPlantControls.gsrnNumber.reset();
      powerPlantControls.connectionType.reset();

      powerPlantControls.assetType.reset();
      powerPlantControls.assetType.markAsPristine();
      powerPlantControls.assetType.markAsUntouched();
    }
  });

  isRequired(control: FormControl): boolean {
    return control.hasValidator(Validators.required);
  }

  save() {
    console.log('Saving metering point', this.form.value);
  }
}
