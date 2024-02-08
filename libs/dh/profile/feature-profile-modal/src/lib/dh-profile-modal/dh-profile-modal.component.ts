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
import { Component, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, translate } from '@ngneat/transloco';

type UserPreferencesForm = FormGroup<{
  email: FormControl<string>;
  phone: FormControl<string>;
  language: FormControl<string>;
  firstname: FormControl<string>;
  lastname: FormControl<string>;
}>;

@Component({
  selector: 'dh-profile-modal',
  standalone: true,
  styles: `.names {
    width:75%;
  }`,
  imports: [
    WATT_MODAL,
    WattTextFieldComponent,
    WattPhoneFieldComponent,
    WattDropdownComponent,
    WattButtonComponent,
    TranslocoDirective,
    VaterStackComponent,
    VaterFlexComponent,
    DhDropdownTranslatorDirective,
    ReactiveFormsModule,
  ],
  template: `<watt-modal *transloco="let t; read: 'shared.profile'" [title]="t('title')">
    <form [formGroup]="userPreferencesForm" id="userPreferencesForm" (ngSubmit)="save()">
      <vater-flex fill="vertical" gap="m">
        <vater-stack class="names" align="flex-start" direction="column" gap="s">
          <h4>{{ t('myInformation') }}</h4>
          <vater-stack align="flex-start" direction="row" gap="s">
            <watt-text-field
              [label]="t('name')"
              [formControl]="userPreferencesForm.controls.firstname"
            />
            <watt-text-field
              [label]="t('lastname')"
              [formControl]="userPreferencesForm.controls.lastname"
            />
          </vater-stack>

          <watt-text-field
            [label]="t('email')"
            [formControl]="userPreferencesForm.controls.email"
          />
          <watt-phone-field
            [label]="t('phone')"
            [formControl]="userPreferencesForm.controls.phone"
          />
          <h4>{{ t('general') }}</h4>
          <watt-dropdown
            [label]="t('language')"
            [formControl]="userPreferencesForm.controls.language"
            [options]="languages"
            dhDropdownTranslator
            translate="shared.profile.languages"
          />
        </vater-stack>
      </vater-flex>
    </form>
    <watt-modal-actions>
      <watt-button variant="secondary" (click)="closeModal(false)">{{ t('cancel') }}</watt-button>
      <watt-button variant="secondary" type="submit" formId="userPreferencesForm">{{
        t('save')
      }}</watt-button>
    </watt-modal-actions>
  </watt-modal>`,
})
export class DhProfileModalComponent {
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  private readonly _toastService = inject(WattToastService);

  @ViewChild(WattModalComponent)
  private _profileModal!: WattModalComponent;

  languages: WattDropdownOptions = [
    { value: 'en', displayValue: 'English' },
    { value: 'da', displayValue: 'Danish' },
  ];

  userPreferencesForm: UserPreferencesForm = this._formBuilder.group({
    email: ['', Validators.required],
    phone: ['', Validators.required],
    language: ['da', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
  });

  closeModal(saveSuccess: boolean) {
    this._profileModal.close(saveSuccess);
  }

  save() {
    this._toastService.open({
      type: 'success',
      message: translate('shared.profile.success'),
    });
    console.log('save user preferences');
    // save user preferences
  }
}
