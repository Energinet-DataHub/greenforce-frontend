//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.  nameAddressProtectionControl: FormControl {
    return this.form.get('nameAddressProtection') as FormControl;
  }
}

export { DhCustomerDetailsFormComponent };You may obtain a copy of the License at
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
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattFieldComponent, WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dh-customer-details-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoDirective,
    WattFieldComponent,
    WattFieldErrorComponent,
    WattDatepickerComponent,
    VaterStackComponent,
    WattDropdownComponent,
    WattRadioComponent,
    WattCheckboxComponent,
    WattTextFieldComponent,
  ],
  template: `
    <div
      class="customer-details-form"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.customerDetails'"
    >
      <vater-stack direction="column" gap="m">
        <h3>{{ t('customerDetails') }}</h3>

        <!-- Transaction ID -->
        <watt-field [label]="t('transactionId.label')">
          <watt-text-field
            [formControl]="transactionIdControl"
            [placeholder]="t('transactionId.placeholder')"
          >
            <watt-field-error
              *ngIf="transactionIdControl.errors?.['required'] && transactionIdControl.touched"
            >
              {{ t('validation.required') }}
            </watt-field-error>
          </watt-text-field>
        </watt-field>

        <!-- Cut Date -->
        <watt-field [label]="t('cutDate.label')">
          <watt-datepicker [formControl]="cutDateControl"></watt-datepicker>
          <watt-field-error *ngIf="cutDateControl.errors?.['required'] && cutDateControl.touched">
            {{ t('validation.required') }}
          </watt-field-error>
        </watt-field>

        <!-- Reason Code -->
        <watt-field [label]="t('reasonCode.label')">
          <watt-dropdown
            [formControl]="reasonCodeControl"
            [placeholder]="t('reasonCode.placeholder')"
            [options]="[
              { value: 'code1', displayValue: t('reasonCode.options.code1') },
              { value: 'code2', displayValue: t('reasonCode.options.code2') },
              { value: 'code3', displayValue: t('reasonCode.options.code3') },
            ]"
          ></watt-dropdown>
          <watt-field-error
            *ngIf="reasonCodeControl.errors?.['required'] && reasonCodeControl.touched"
          >
            {{ t('validation.required') }}
          </watt-field-error>
        </watt-field>

        <!-- Customer Type Radio -->
        <watt-field [label]="t('customerType.label')">
          <div
            style="display: flex; gap: var(--watt-space-m); flex-direction: column; margin-bottom: var(--watt-space-m);"
          >
            <watt-radio group="customerType" [formControl]="customerTypeControl" value="private">{{
              t('customerType.options.private')
            }}</watt-radio>
            <watt-radio group="customerType" [formControl]="customerTypeControl" value="business">{{
              t('customerType.options.business')
            }}</watt-radio>
          </div>
        </watt-field>

        <!-- Customer Name 1 -->
        <watt-field [label]="t('customerName1.label')">
          <watt-text-field
            [formControl]="customerName1Control"
            [placeholder]="t('customerName1.placeholder')"
          >
            <watt-field-error
              *ngIf="customerName1Control.errors?.['required'] && customerName1Control.touched"
            >
              {{ t('validation.required') }}
            </watt-field-error>
          </watt-text-field>
        </watt-field>

        <!-- CPR 1 -->
        <watt-field [label]="t('cpr1.label')">
          <watt-text-field
            type="number"
            [formControl]="cpr1Control"
            [placeholder]="t('cpr1.placeholder')"
          >
            <watt-field-error *ngIf="cpr1Control.errors?.['required'] && cpr1Control.touched">
              {{ t('validation.required') }}
            </watt-field-error>
          </watt-text-field>
        </watt-field>

        <!-- Customer Name 2 - Only visible when type is private -->
        <watt-field [label]="t('customerName2.label')" *ngIf="isPrivateCustomer()">
          <watt-text-field
            [formControl]="customerName2Control"
            [placeholder]="t('customerName2.placeholder')"
          >
          </watt-text-field>
        </watt-field>

        <!-- CPR 2 - Only visible when type is private but disabled -->
        <watt-field [label]="t('cpr2.label')" *ngIf="isPrivateCustomer()">
          <watt-text-field
            type="number"
            [formControl]="cpr2Control"
            [placeholder]="t('cpr2.placeholder')"
            [disabled]="true"
          >
          </watt-text-field>
        </watt-field>

        <!-- Name and Address Protection -->
        <watt-checkbox [formControl]="nameAddressProtectionControl">
          {{ t('nameAddressProtection.label') }}
        </watt-checkbox>
      </vater-stack>
    </div>
  `,
  styles: `
    .customer-details-form {
      display: block;
      padding: var(--watt-space-m);
    }
  `,
})
export class DhCustomerDetailsFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  ngOnInit(): void {
    // Set the default customer type to private
    if (this.customerTypeControl.value === null) {
      this.customerTypeControl.setValue('private');
    }

    // Listen to changes in customer type to handle conditional visibility
    this.customerTypeControl.valueChanges.subscribe((value) => {
      if (value === 'private') {
        this.customerName2Control.enable();
        this.cpr2Control.disable();
      } else {
        this.customerName2Control.disable();
        this.cpr2Control.disable();
      }
    });
  }

  isPrivateCustomer(): boolean {
    return this.customerTypeControl.value === 'private';
  }

  // Form controls with typecasting
  get transactionIdControl(): FormControl {
    return this.formGroup.get('transactionId') as FormControl;
  }

  get cutDateControl(): FormControl {
    return this.formGroup.get('cutDate') as FormControl;
  }

  get reasonCodeControl(): FormControl {
    return this.formGroup.get('reasonCode') as FormControl;
  }

  get customerTypeControl(): FormControl {
    return this.formGroup.get('customerType') as FormControl;
  }

  get customerName1Control(): FormControl {
    return this.formGroup.get('customerName1') as FormControl;
  }

  get cpr1Control(): FormControl {
    return this.formGroup.get('cpr1') as FormControl;
  }

  get customerName2Control(): FormControl {
    return this.formGroup.get('customerName2') as FormControl;
  }

  get cpr2Control(): FormControl {
    return this.formGroup.get('cpr2') as FormControl;
  }

  get nameAddressProtectionControl(): FormControl {
    return this.formGroup.get('nameAddressProtection') as FormControl;
  }
}
