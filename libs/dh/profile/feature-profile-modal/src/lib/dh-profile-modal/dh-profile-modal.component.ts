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
import { Component, ViewChild, inject, signal } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
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
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  private readonly _toastService = inject(WattToastService);
  private readonly _apollo = inject(Apollo);
  private readonly _profileModalService = inject(DhProfileModalService);

  private readonly _getUserProfileQuery = this._apollo.watchQuery({
    returnPartialData: true,
    query: GetUserProfileDocument,
  });
  protected loadingUserProfile = signal<boolean>(false);
  protected updatingUserProfile = signal<boolean>(false);

  @ViewChild(WattModalComponent)
  private _profileModal!: WattModalComponent;

  userPreferencesForm: UserPreferencesForm = this._formBuilder.group({
    email: { value: this.modalData.email, disabled: true },
    phoneNumber: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  constructor() {
    super();
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

    const { firstName, lastName, phoneNumber } = this.userPreferencesForm.getRawValue();

    this._apollo
      .mutate<UpdateUserProfileMutation>({
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
      .subscribe((result) => this.handleUpdateUserProfileResponse(result));
  }

  private handleUpdateUserProfileResponse(response: MutationResult<UpdateUserProfileMutation>) {
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
      this._profileModalService.notifyAboutProfileUpdate();
    }
  }
}
