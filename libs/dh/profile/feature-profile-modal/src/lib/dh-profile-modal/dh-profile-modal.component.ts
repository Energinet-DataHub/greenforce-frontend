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
import { Apollo } from 'apollo-angular';

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

import { GetUserProfileDocument } from '@energinet-datahub/dh/shared/domain/graphql';

type UserPreferencesForm = FormGroup<{
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  language: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
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

    h3 {
      margin-bottom: var(--watt-space-s);
    }

    .names {
      width: 75%;
    }

    .phone-field, .lang-field, .mitid-field {
      width: 50%;
      display: block;
    }
  `,
  templateUrl: './dh-profile-modal.component.html',
})
export class DhProfileModalComponent {
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  private readonly _toastService = inject(WattToastService);
  private readonly _languageService = inject(DhLanguageService);
  private readonly _apollo = inject(Apollo);
  private readonly _getUserProfileQuery = this._apollo.watchQuery({
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetUserProfileDocument,
  });

  @ViewChild(WattModalComponent)
  private _profileModal!: WattModalComponent;

  languages: WattDropdownOptions = dhEnumToWattDropdownOptions(DisplayLanguage);

  userPreferencesForm: UserPreferencesForm = this._formBuilder.group({
    email: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    language: [this._languageService.selectedLanguage],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  constructor() {
    this._getUserProfileQuery.valueChanges.subscribe((result) => {
      const { firstName, lastName, phoneNumber } = result.data.userProfile;
      this.userPreferencesForm.patchValue({ phoneNumber, firstName, lastName });
    });
  }

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
