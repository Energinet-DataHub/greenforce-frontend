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
import { BusinessCustomerFormGroup } from '../types';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

@Component({
  selector: 'dh-business-customer-details-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattTextFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
 template: `
   <form>
     @let form = businessCustomerFormGroup();
     <form [formGroup]="form" *transloco="let t; prefix: 'meteringPoint.moveIn.steps.customerDetails'">
       <watt-text-field [label]="t('companyName')" [formControl]="form.controls.companyName" />
       <watt-text-field [label]="t('cvr')" [formControl]="form.controls.cvr" />
     </form>
   </form>
 `,
})
export class DhBusinessCustomerDetailsFormComponent {
  businessCustomerFormGroup = input.required<FormGroup<BusinessCustomerFormGroup>>();
}
