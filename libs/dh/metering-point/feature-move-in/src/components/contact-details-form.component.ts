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
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { MoveInContactDetailsFormType } from '../types';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

@Component({
  selector: 'dh-contact-details-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattCheckboxComponent,
    WattTextFieldComponent,
    WattPhoneFieldComponent,
    VaterFlexComponent,
    WattFieldErrorComponent,
  ],
  template: `
    @let form = contactDetailsForm();
    @let legalControls = form.controls.legalContactGroup.controls;
    @let technicalControls = form.controls.technicalContactGroup.controls;
    <form
      [formGroup]="form"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.contactDetails'"
    >
      <!-- Legal Contact Section -->
      <vater-flex gap="xl" direction="row">
        <vater-flex align="stretch">
          <h3>
            {{ t('legalContactSection') }}
          </h3>
          <watt-checkbox [formControl]="form.controls.legalContactSameAsCustomer" data-testid="legal-contact-same-as-customer">
            {{ t('contactSameAsCustomer') }}
          </watt-checkbox>

          <watt-text-field [formControl]="legalControls.name" [label]="t('contactName')" data-testid="legal-contact-name" />

          <watt-text-field [formControl]="legalControls.title" [label]="t('attention')" data-testid="legal-contact-title" />

          <watt-phone-field [formControl]="legalControls.phone" [label]="t('phoneNumber')" data-testid="legal-contact-phone" />

          <watt-phone-field [formControl]="legalControls.mobile" [label]="t('mobile')" data-testid="legal-contact-mobile" />

          <watt-text-field [formControl]="legalControls.email" [label]="t('email')" type="email" data-testid="legal-contact-email">
            <watt-field-error>
              @if (legalControls.email.hasError('email')) {
                {{ t('invalidEmail') }}
              }
            </watt-field-error>
          </watt-text-field>
        </vater-flex>
        <!-- Technical Contact Section -->
        <vater-flex align="stretch">
          <h3>
            {{ t('technicalContactSection') }}
          </h3>
          <watt-checkbox [formControl]="form.controls.technicalContactSameAsLegal" data-testid="technical-contact-same-as-legal">
            {{ t('technicalContactSameAsLegal') }}
          </watt-checkbox>

          <watt-text-field [formControl]="technicalControls.name" [label]="t('contactName')" data-testid="technical-contact-name" />
          <watt-text-field [formControl]="technicalControls.title" [label]="t('attention')" data-testid="technical-contact-title" />
          <watt-phone-field [formControl]="technicalControls.phone" [label]="t('phoneNumber')" data-testid="technical-contact-phone" />
          <watt-phone-field [formControl]="technicalControls.mobile" [label]="t('mobile')" data-testid="technical-contact-mobile" />

          <watt-text-field
            [formControl]="technicalControls.email"
            [label]="t('email')"
            type="email"
            data-testid="technical-contact-email"
          >
            <watt-field-error>
              @if (technicalControls.email.invalid) {
                {{ t('invalidEmail') }}
              }
            </watt-field-error>
          </watt-text-field>
        </vater-flex>
      </vater-flex>
    </form>
  `,
})
export class DhContactDetailsFormComponent {
  contactDetailsForm = input.required<FormGroup<MoveInContactDetailsFormType>>();
}
