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
import { TranslocoDirective } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { DhCustomerDetailsFormComponent } from './dh-customer-details-form.component';

@Component({
  selector: 'dh-move-in',
  imports: [TranslocoDirective, WATT_MODAL, WATT_STEPPER, DhCustomerDetailsFormComponent],
  template: `
    <watt-modal
      #modal
      size="large"
      [title]="t('title')"
      *transloco="let t; prefix: 'meteringPoint.moveIn'"
    >
      <watt-stepper
        class="watt-modal-content--full-width"
        [linear]="true"
        (completed)="startMoveIn()"
      >
        <watt-stepper-step
          [stepControl]="customerDetailsForm"
          [label]="t('steps.customerDetails.label')"
          [nextButtonLabel]="t('steps.contactDetails.label')"
        >
          <dh-customer-details-form [formGroup]="customerDetailsForm"></dh-customer-details-form>
        </watt-stepper-step>

        <watt-stepper-step
          [stepControl]="contactDetailsForm"
          [label]="t('steps.contactDetails.label')"
          [previousButtonLabel]="t('steps.customerDetails.label')"
          [nextButtonLabel]="t('save')"
          [loadingNextButton]="false"
        />
      </watt-stepper>
    </watt-modal>
  `,
})
export class DhMoveInComponent extends WattTypedModal {
  private readonly fb = inject(NonNullableFormBuilder);

  customerDetailsForm = this.fb.group({
    transactionId: this.fb.control<string | null>(null, [Validators.required]),
    cutDate: this.fb.control<Date | null>(null, [Validators.required]),
    reasonCode: this.fb.control<string | null>(null, [Validators.required]),
    customerType: this.fb.control<string | null>(null, [Validators.required]),
    customerName1: this.fb.control<string | null>(null, [Validators.required]),
    cpr1: this.fb.control<string | null>(null, [Validators.required]),
    customerName2: this.fb.control<string | null>(null),
    cpr2: this.fb.control<string | null>(null),
    nameAddressProtection: this.fb.control<boolean>(false),
  });

  contactDetailsForm = this.fb.group({
    // Define form controls and validation here
  });

  startMoveIn() {
    console.log('Starting move-in process...');
  }
}
