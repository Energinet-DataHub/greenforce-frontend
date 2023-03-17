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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryObj, Meta, moduleMetadata } from '@storybook/angular';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { WattInputModule } from '../../input';
import { WattFormFieldModule } from '../../form-field';

import { WATT_STEPPER, WattStepperComponent } from './../index';

export default {
  title: 'Components/Stepper',
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        WATT_STEPPER,
        WattInputModule,
        ReactiveFormsModule,
        WattFormFieldModule,
      ],
    }),
  ],
  component: WattStepperComponent,
} as Meta<WattStepperComponent>;

const template = `
<watt-stepper>
  <watt-stepper-step>
    <form [formGroup]="user">
      <ng-template matStepLabel>User</ng-template>
      <watt-form-field class="firstname">
      <watt-label>firstname</watt-label>
      <input [formControl]="user.controls.firstname" wattInput type="text" />
      <watt-error *ngIf="user.controls.firstname.hasError('required')">Error</watt-error>
    </watt-form-field>
    <watt-form-field class="lastname">
      <watt-label>lastname</watt-label>
      <input [formControl]="user.controls.lastname" wattInput type="text" />
      <watt-error *ngIf="user.controls.lastname.hasError('required')">
        Error
      </watt-error>
    </watt-form-field>
    </form>
  </watt-stepper-step>
  <watt-stepper-step>
    <form [formGroup]="email">
      <ng-template matStepLabel>email</ng-template>
      <watt-form-field class="email">
      <watt-label>email</watt-label>
      <input [formControl]="email.controls.email" wattInput type="text" />
      <watt-error *ngIf="email.controls.email.hasError('required')">Error</watt-error>
    </watt-form-field>
    </form>
  </watt-stepper-step>
  <watt-stepper-step>
    <form [formGroup]="address">
      <ng-template matStepLabel>Address</ng-template>
      <watt-form-field class="street">
        <watt-label>street</watt-label>
        <input [formControl]="address.controls.street" wattInput type="text" />
        <watt-error *ngIf="address.controls.street.hasError('required')">Error</watt-error>
      </watt-form-field>
      <watt-form-field class="city">
        <watt-label>city</watt-label>
        <input [formControl]="address.controls.city" wattInput type="text" />
        <watt-error *ngIf="address.controls.city.hasError('required')">
          Error
        </watt-error>
      </watt-form-field>
    </form>

  </watt-stepper-step>
</watt-stepper>`;

export const stepper: StoryObj<WattStepperComponent> = {
  render: (args) => {
    const userForm = new FormBuilder().group({
      firstname: [''],
      lastname: [''],
    });
    const addressForm = new FormBuilder().group({ street: [''], city: [''] });
    const emailForm = new FormBuilder().group({ email: [''] });
    return {
      props: { ...args, user: userForm, address: addressForm, email: emailForm },
      template,
    };
  },

  parameters: {
    docs: {
      source: {
        code: template,
      },
    },
  },
};
