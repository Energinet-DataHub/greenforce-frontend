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
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet/watt/phone-field';
import { ContactDetailsFormType } from '../types';
import { VaterFlexComponent } from '@energinet/watt/vater';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';

@Component({
  selector: 'dh-contact-details',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattTextFieldComponent,
    WattPhoneFieldComponent,
    VaterFlexComponent,
    WattFieldErrorComponent,
    WattSlideToggleComponent,
  ],
  styles: `
    .slide-toggle-margin-bottom {
      margin-bottom: var(--watt-space-m);
    }
  `,
  template: `
    @let formGroup = contactDetailsFormGroup();
    @let controls = formGroup.controls.contactGroup.controls;
    <ng-container
      [formGroup]="formGroup"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.contactDetails'"
    >
      <vater-flex gap="xl" direction="row">
        <vater-flex align="stretch">
          <watt-slide-toggle
            [formControl]="formGroup.controls.contactSameAsCustomer"
            class="slide-toggle-margin-bottom"
            data-testid="legal-contact-same-as-customer"
          >
            {{ t('contactSameAsCustomer') }}
          </watt-slide-toggle>

          <watt-text-field
            [formControl]="controls.name"
            [label]="t('contactName')"
            data-testid="legal-contact-name"
          />

          <watt-text-field
            [formControl]="controls.title"
            [label]="t('attention')"
            data-testid="legal-contact-title"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-phone-field
              [formControl]="controls.phone"
              [label]="t('phoneNumber')"
              data-testid="legal-contact-phone"
            />

            <watt-phone-field
              [formControl]="controls.mobile"
              [label]="t('mobile')"
              data-testid="legal-contact-mobile"
            />
          </vater-flex>

          <watt-text-field
            [formControl]="controls.email"
            [label]="t('email')"
            type="email"
            data-testid="legal-contact-email"
          >
            <watt-field-error>
              @if (controls.email.hasError('email')) {
                {{ t('invalidEmail') }}
              }
            </watt-field-error>
          </watt-text-field>
        </vater-flex>
      </vater-flex>
    </ng-container>
  `,
})
export class DhContactDetailsComponent {
  contactDetailsFormGroup = input.required<FormGroup<ContactDetailsFormType>>();
}
