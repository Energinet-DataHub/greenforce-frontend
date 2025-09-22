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
import { TranslocoDirective } from '@jsverse/transloco';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { dayjs } from '@energinet-datahub/watt/date';

import {
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';

import { MoveInCustomerDetailsFormType, MoveInType } from '../types';

@Component({
  selector: 'dh-move-in',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    WATT_STEPPER,
    WattTextFieldComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattRadioComponent,
    WattCheckboxComponent,
    VaterStackComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    .cutOffDate,
    .moveInType {
      width: 320px;
    }

    .name {
      width: 250px;
    }

    .cpr,
    .cvr {
      width: 150px;
    }
  `,
  templateUrl: './move-in.component.html',
})
export class DhMoveInComponent extends WattTypedModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly customerTypeInitialValue = 'private';

  private privateCustomerForm = this.fb.group({
    name1: this.fb.control<string>('', Validators.required),
    cpr1: this.fb.control<string>('', Validators.required),
    name2: this.fb.control<string>(''),
    cpr2: this.fb.control<string>({ value: '', disabled: true }, Validators.required),
  });

  customerDetailsForm = this.fb.group<MoveInCustomerDetailsFormType>({
    cutOffDate: this.fb.control(new Date(), Validators.required),
    moveInType: this.fb.control<string>('', Validators.required),
    customerType: this.fb.control(this.customerTypeInitialValue),
    isProtectedAddress: this.fb.control<boolean>(false),
  });

  contactDetailsForm = this.fb.group({
    // Define form controls and validation here
  });

  yesterday = dayjs().subtract(1, 'day').toDate();

  moveInTypeDropdownOptions = dhEnumToWattDropdownOptions(MoveInType);

  private customerTypeChanged = toSignal(
    this.customerDetailsForm.controls.customerType.valueChanges,
    { initialValue: this.customerTypeInitialValue }
  );

  private name2Changed = toSignal(this.privateCustomerForm.controls.name2.valueChanges);

  private customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType === 'private') {
      this.customerDetailsForm.addControl('privateCustomer', this.privateCustomerForm);
      this.customerDetailsForm.removeControl('businessCustomer');
    } else {
      this.customerDetailsForm.addControl(
        'businessCustomer',
        this.fb.group({
          companyName: this.fb.control<string>(''),
          cvr: this.fb.control<string>('', Validators.required),
        })
      );

      this.customerDetailsForm.removeControl('privateCustomer');
      this.privateCustomerForm.reset();
    }
  });

  private name2Effect = effect(() => {
    const name2 = this.name2Changed();
    const cpr2Control = this.privateCustomerForm.controls.cpr2;

    if (name2) {
      cpr2Control.enable();
    } else {
      cpr2Control.disable();
      cpr2Control.reset();
    }
  });

  startMoveIn() {
    console.log('Starting move-in process...');
  }
}
