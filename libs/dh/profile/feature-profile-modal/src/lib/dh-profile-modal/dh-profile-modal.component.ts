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
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { MutationResult } from 'apollo-angular';
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
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhMitIDButtonComponent } from '@energinet-datahub/dh/shared/feature-authorization';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  GetUserProfileDocument,
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
  standalone: true,
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

  private readonly getUserProfileQuery = query(GetUserProfileDocument, { returnPartialData: true });
  private readonly updateUserProfileMutation = mutation(UpdateUserProfileDocument);

  private profileModal = viewChild.required(WattModalComponent);

  private userProfile = computed(() => this.getUserProfileQuery.data()?.userProfile);

  hasFederatedLogin = computed(() => this.userProfile()?.hasFederatedLogin);

  loadingUserProfile = this.getUserProfileQuery.loading;
  updatingUserProfile = this.updateUserProfileMutation.loading;

  userPreferencesForm: UserPreferencesForm = this.formBuilder.group({
    email: { value: this.modalData.email, disabled: true },
    phoneNumber: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  constructor() {
    super();
    effect(
      () => {
        const userProfile = this.userProfile();
        if (userProfile === undefined) return;
        const { phoneNumber, firstName, lastName } = userProfile;
        this.userPreferencesForm.patchValue({ phoneNumber, firstName, lastName });
      },
      { allowSignalWrites: true }
    );
  }

  closeModal(saveSuccess: boolean) {
    this.profileModal().close(saveSuccess);
  }

  async save() {
    if (this.userPreferencesForm.invalid) {
      return;
    }

    const { firstName, lastName, phoneNumber } = this.userPreferencesForm.getRawValue();

    const response = await this.updateUserProfileMutation.mutate({
      refetchQueries: [GetUserProfileDocument],
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
