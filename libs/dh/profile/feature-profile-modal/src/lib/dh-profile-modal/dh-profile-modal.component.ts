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
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, translate } from '@ngneat/transloco';
import { DhLanguageService } from '@energinet-datahub/dh/globalization/feature-language-picker';
import { DisplayLanguage } from '@energinet-datahub/dh/globalization/domain';
import { DhSignupMitIdComponent } from '@energinet-datahub/dh/shared/feature-authorization';

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
    DhSignupMitIdComponent,
    ReactiveFormsModule,
  ],
  styles: `
    .names {
      width:75%;
    }

    .mitid-container {
      width:50%;
    }
  `,
  templateUrl: './dh-profile-modal.component.html',
})
export class DhProfileModalComponent {
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  private readonly _toastService = inject(WattToastService);
  private readonly _languageService = inject(DhLanguageService);

  @ViewChild(WattModalComponent)
  private _profileModal!: WattModalComponent;

  languages: WattDropdownOptions = dhEnumToWattDropdownOptions(DisplayLanguage);

  userPreferencesForm: UserPreferencesForm = this._formBuilder.group({
    email: ['', Validators.required],
    phone: ['', Validators.required],
    language: [this._languageService.selectedLanguage],
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

    const { language } = this.userPreferencesForm.getRawValue();

    this._languageService.selectedLanguage = language;
    console.log('save user preferences');
    // save user preferences
  }
}
