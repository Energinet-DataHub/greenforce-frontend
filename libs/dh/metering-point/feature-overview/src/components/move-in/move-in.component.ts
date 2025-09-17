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

import { MoveInCustomerDetailsFormType } from '../../types';

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
  ],
  styles: `
    .transactionId,
    .cutOffDate,
    .reason {
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

  customerDetailsForm = this.fb.group<MoveInCustomerDetailsFormType>({
    transactionId: this.fb.control<string>({ value: '', disabled: true }, Validators.required),
    cutOffDate: this.fb.control<string>('', Validators.required),
    reason: this.fb.control<string>('', Validators.required),
    customerType: this.fb.control('private'),
    privateCustomer: this.fb.group({
      name1: this.fb.control<string>('', Validators.required),
      cpr1: this.fb.control<string>('', Validators.required),
      name2: this.fb.control<string | undefined>(undefined),
      cpr2: this.fb.control<string | undefined>({ value: undefined, disabled: true }),
    }),
    isProtectedAddress: this.fb.control<boolean>(false),
  });

  contactDetailsForm = this.fb.group({
    // Define form controls and validation here
  });

  private customerTypeChanged = toSignal(
    this.customerDetailsForm.controls.customerType.valueChanges
  );

  private customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType == undefined) return;

    if (customerType === 'private') {
      this.customerDetailsForm.addControl(
        'privateCustomer',
        this.fb.group({
          name1: this.fb.control<string>('', Validators.required),
          cpr1: this.fb.control<string>('', Validators.required),
          name2: this.fb.control<string | undefined>(undefined),
          cpr2: this.fb.control<string | undefined>({ value: undefined, disabled: true }),
        })
      );

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
    }
  });

  startMoveIn() {
    console.log('Starting move-in process...');
  }
}
