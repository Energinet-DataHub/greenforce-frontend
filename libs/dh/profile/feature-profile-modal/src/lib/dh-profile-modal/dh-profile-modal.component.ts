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
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { WattToastService } from '@energinet/watt/toast';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet/watt/phone-field';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { DhMitIDButtonComponent } from '@energinet-datahub/dh/shared/feature-authorization';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/domain';
import {
  UserProfileDocument,
  UpdateUserProfileDocument,
  UpdateUserProfileMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhProfileModalService } from './dh-profile-modal.service';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';

type UserPreferencesForm = FormGroup<{
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
}>;

@Component({
  selector: 'dh-profile-modal',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ReactiveFormsModule,
    WATT_MODAL,
    WattTextFieldComponent,
    WattPhoneFieldComponent,
    WattButtonComponent,
    VaterStackComponent,
    VaterFlexComponent,
    DhMitIDButtonComponent,
  ],
  styles: `
    h4 {
      margin: 0;
      margin-bottom: var(--watt-space-s);
    }

    .names {
      width: 75%;
    }

    .phone-field,
    .lang-field,
    .mitid-field {
      width: 50%;
      display: block;
    }
  `,
  templateUrl: './dh-profile-modal.component.html',
})
export class DhProfileModalComponent extends WattTypedModal<{ email: string }> {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly profileModalService = inject(DhProfileModalService);

  private readonly userProfileQuery = query(UserProfileDocument, { returnPartialData: true });
  private readonly userProfileMutation = mutation(UpdateUserProfileDocument);

  private profileModal = viewChild.required(WattModalComponent);

  private userProfile = computed(() => this.userProfileQuery.data()?.userProfile);

  hasFederatedLogin = computed(() => this.userProfile()?.hasFederatedLogin);

  loadingUserProfile = this.userProfileQuery.loading;
  updatingUserProfile = this.userProfileMutation.loading;

  userPreferencesForm: UserPreferencesForm = this.formBuilder.group({
    email: { value: this.modalData.email, disabled: true },
    phoneNumber: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  constructor() {
    super();
    effect(() => {
      const userProfile = this.userProfile();
      if (userProfile === undefined) return;
      const { phoneNumber, firstName, lastName } = userProfile;
      this.userPreferencesForm.patchValue({ phoneNumber, firstName, lastName });
    });
  }

  closeModal(saveSuccess: boolean) {
    this.profileModal().close(saveSuccess);
  }

  async save() {
    if (this.userPreferencesForm.invalid) {
      return;
    }

    const { firstName, lastName, phoneNumber } = this.userPreferencesForm.getRawValue();

    const response = await this.userProfileMutation.mutate({
      refetchQueries: [UserProfileDocument],
      variables: {
        input: {
          userProfileUpdateDto: {
            firstName,
            lastName,
            phoneNumber,
          },
        },
      },
    });

    this.handleUpdateUserProfileResponse(response);
  }

  private handleUpdateUserProfileResponse(response: MutationResult<UpdateUserProfileMutation>) {
    if (
      response.data?.updateUserProfile?.errors &&
      response.data?.updateUserProfile?.errors.length > 0
    ) {
      this.toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.updateUserProfile?.errors),
      });
    }

    if (response.data?.updateUserProfile?.saved) {
      this.toastService.open({ message: translate('shared.profile.success'), type: 'success' });
      this.closeModal(true);
      this.profileModalService.notifyAboutProfileUpdate();
    }
  }
}
