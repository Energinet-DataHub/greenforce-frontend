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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';

import { PrivateCustomerFormGroup } from '../types';
import { DhCprFieldComponent } from './dh-cpr-field.component';

@Component({
  selector: 'dh-private-customer-details',
  imports: [
    ReactiveFormsModule,
    WattTextFieldComponent,
    TranslocoDirective,
    WattCheckboxComponent,
    DhCprFieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .margin-top-l {
      margin-top: var(--watt-space-l);
    }
  `,
  template: `
    @let formGroup = privateCustomerFormGroup();
    <ng-container *transloco="let t; prefix: 'meteringPoint.moveIn.customerDetails'">
      <h4>{{ t('customer1') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName1" />
      <dh-cpr-field
        [cprControl]="formGroup.controls.cpr1"
        [contactId]="contactId1()"
        [maskCpr]="maskCprFields()"
      />

      <h4>{{ t('customer2') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName2" />
      <dh-cpr-field
        class="watt-space-stack-l"
        [cprControl]="formGroup.controls.cpr2"
        [contactId]="contactId2()"
        [maskCpr]="maskCprFields()"
      />

      <watt-checkbox
        [formControl]="formGroup.controls.nameProtection"
        class="watt-space-stack-m margin-top-l"
        data-testid="name-protection"
      >
        {{ t('nameProtection') }}
      </watt-checkbox>
    </ng-container>
  `,
})
export class DhPrivateCustomerDetailsComponent {
  readonly privateCustomerFormGroup = input.required<FormGroup<PrivateCustomerFormGroup>>();
  readonly contactId1 = input<string | null>(null);
  readonly contactId2 = input<string | null>(null);
  readonly maskCprFields = input<boolean>(false);
}
