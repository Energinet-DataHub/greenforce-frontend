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
import { PrivateCustomerFormGroup } from '../types';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';

@Component({
  selector: 'dh-private-customer-details',
  imports: [
    ReactiveFormsModule,
    WattTextFieldComponent,
    TranslocoDirective,
    WattFieldErrorComponent,
    WattCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let formGroup = privateCustomerFormGroup();
    <ng-container
      [formGroup]="formGroup"
      *transloco="let t; prefix: 'meteringPoint.moveIn.customerDetails'"
    >
      <h4>{{ t('customer1') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName1" />
      <watt-text-field [label]="t('cpr')" [formControl]="formGroup.controls.cpr1">
        <watt-field-error>
          @if (formGroup.controls.cpr1.hasError('containsLetters')) {
            {{ t('cprError.containsLetters') }}
          } @else if (formGroup.controls.cpr1.hasError('containsDash')) {
            {{ t('cprError.containsDash') }}
          } @else if (formGroup.controls.cpr1.hasError('invalidCprLength')) {
            {{ t('cprError.invalidCprLength') }}
          } @else if (formGroup.controls.cpr1.hasError('invalidDate')) {
            {{ t('cprError.invalidDate') }}
          } @else if (formGroup.controls.cpr1.hasError('allOnes')) {
            {{ t('cprError.allOnes') }}
          }
        </watt-field-error>
      </watt-text-field>
      <h4>{{ t('customer2') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName2" />
      <watt-text-field
        [label]="t('cpr')"
        [formControl]="formGroup.controls.cpr2"
        class="watt-space-stack-l"
      >
        <watt-field-error>
          @if (formGroup.controls.cpr2.hasError('containsLetters')) {
            {{ t('cprError.containsLetters') }}
          } @else if (formGroup.controls.cpr2.hasError('containsDash')) {
            {{ t('cprError.containsDash') }}
          } @else if (formGroup.controls.cpr2.hasError('invalidCprLength')) {
            {{ t('cprError.invalidCprLength') }}
          } @else if (formGroup.controls.cpr2.hasError('invalidDate')) {
            {{ t('cprError.invalidDate') }}
          } @else if (formGroup.controls.cpr2.hasError('allOnes')) {
            {{ t('cprError.allOnes') }}
          }
        </watt-field-error>
      </watt-text-field>
      <watt-checkbox
        [formControl]="formGroup.controls.nameProtection"
        class="watt-space-stack-m"
        data-testid="name-protection"
      >
        {{ t('nameProtection') }}
      </watt-checkbox>
    </ng-container>
  `,
})
export class DhPrivateCustomerDetailsComponent {
  privateCustomerFormGroup = input.required<FormGroup<PrivateCustomerFormGroup>>();
}
