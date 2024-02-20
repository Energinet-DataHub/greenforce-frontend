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
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { Component, ViewChild, inject, signal } from '@angular/core';
import { Apollo, ApolloModule, MutationResult } from 'apollo-angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { DisplayLanguage } from '@energinet-datahub/gf/globalization/domain';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhSignupMitIdComponent } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhLanguageService } from '@energinet-datahub/dh/globalization/feature-language-picker';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  GetUserProfileDocument,
  UpdateUserProfileDocument,
  UpdateUserProfileMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

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
    TranslocoDirective,
    ReactiveFormsModule,
    ApolloModule,

    WATT_MODAL,
    WattTextFieldComponent,
    WattPhoneFieldComponent,
    WattDropdownComponent,
    WattButtonComponent,
    VaterStackComponent,
    VaterFlexComponent,

    DhDropdownTranslatorDirective,
    DhSignupMitIdComponent,
  ],
  styles: `

    h4 {
      margin:0;
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
  private readonly _modalData = inject(MAT_DIALOG_DATA);
  private readonly _getUserProfileQuery = this._apollo.watchQuery({
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetUserProfileDocument,
  });
  protected loadingUserProfile = signal<boolean>(false);
  protected updatingUserProfile = signal<boolean>(false);

  @ViewChild(WattModalComponent)
  private _profileModal!: WattModalComponent;

  languages: WattDropdownOptions = dhEnumToWattDropdownOptions(DisplayLanguage);

  userPreferencesForm: UserPreferencesForm = this._formBuilder.group({
    email: { value: this._modalData.email, disabled: true },
    phoneNumber: ['', Validators.required],
    language: [this._languageService.selectedLanguage],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  constructor() {
    this._getUserProfileQuery.valueChanges.subscribe((result) => {
      this.loadingUserProfile.set(result.loading);
      if (result.data?.userProfile === undefined) return;

      const { firstName, lastName, phoneNumber } = result.data.userProfile;
      this.userPreferencesForm.patchValue({ phoneNumber, firstName, lastName });
    });
  }

  closeModal(saveSuccess: boolean) {
    this._profileModal.close(saveSuccess);
  }

  save() {
    if (this.userPreferencesForm.invalid) {
      return;
    }

    const { language, firstName, lastName, phoneNumber } = this.userPreferencesForm.getRawValue();

    this._apollo
      .mutate<UpdateUserProfileMutation>({
        useMutationLoading: true,
        mutation: UpdateUserProfileDocument,
        variables: {
          input: {
            userProfileUpdateDto: {
              firstName,
              lastName,
              phoneNumber,
            },
          },
        },
      })
      .subscribe((result) => this.handleUpdateUserProfileResponse(result, language));
  }

  private handleUpdateUserProfileResponse(
    response: MutationResult<UpdateUserProfileMutation>,
    selectedLanguage: string
  ) {
    this.updatingUserProfile.set(response.loading);

    if (
      response.data?.updateUserProfile?.errors &&
      response.data?.updateUserProfile?.errors.length > 0
    ) {
      this._toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.updateUserProfile?.errors),
      });
    }

    if (response.data?.updateUserProfile?.saved) {
      this._toastService.open({ message: translate('shared.profile.success'), type: 'success' });
      this.closeModal(true);
      this._getUserProfileQuery.refetch();
    }

    this._languageService.selectedLanguage = selectedLanguage;
  }
}
