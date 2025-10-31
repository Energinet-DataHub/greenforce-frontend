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
import {
  effect,
  inject,
  signal,
  computed,
  Component,
  viewChild,
  ChangeDetectorRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { translate, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GraphQLFormattedError } from 'graphql';

import { WattToastService } from '@energinet/watt/toast';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet/watt/phone-field';
import { WattModalComponent, WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';
import { WATT_STEPPER } from '@energinet/watt/stepper';
import { WattValidationMessageComponent } from '@energinet/watt/validation-message';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';

import { UserRoleItem } from '@energinet-datahub/dh/admin/data-access-api';
import { lazyQuery, mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import {
  GetUsersDocument,
  InviteUserDocument,
  GetFilteredMarketParticipantsDocument,
  CheckEmailExistsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/domain';

import { DhAssignableUserRolesComponent } from './assignable-user-roles.component';
import { validateIfAlreadyAssociatedToActor, validateIfDomainExists } from './invite.validators';

@Component({
  selector: 'dh-invite-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WATT_STEPPER,
    WattIconComponent,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattPhoneFieldComponent,
    WattValidationMessageComponent,
    DhAssignableUserRolesComponent,
  ],
})
export class DhInviteUserComponent extends WattTypedModal {
  private readonly toastService = inject(WattToastService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly translocoService = inject(TranslocoService);
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);

  private modal = viewChild.required(WattModalComponent);

  private inviteUserMutation = mutation(InviteUserDocument, {
    refetchQueries: [GetUsersDocument],
  });

  private marketParticipantQuery = query(GetFilteredMarketParticipantsDocument);

  private doesEmailExist = lazyQuery(CheckEmailExistsDocument);

  private actors = computed(
    () => this.marketParticipantQuery.data()?.filteredMarketParticipants ?? []
  );

  private domains = computed(
    () => this.actors().find((x) => x.id === this.selectedActorId())?.organization.domains
  );

  loading = computed(
    () => this.inviteUserMutation.loading() || this.marketParticipantQuery.loading()
  );

  actorOptions = computed<WattDropdownOptions>(() =>
    this.actors().map((actor) => ({
      displayValue:
        actor.name + ' (' + translate(`marketParticipant.marketRoles.${actor.marketRole}`) + ')',
      value: actor.id,
    }))
  );

  inOrganizationMailDomain = computed(() => {
    const email = this.emailChanged();
    const domains = this.domains();

    return (
      !!email &&
      !!domains &&
      domains.some((domain) => email.toUpperCase().endsWith(domain.toUpperCase()))
    );
  });

  baseInfo = this.nonNullableFormBuilder.group({
    actorId: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
      [validateIfAlreadyAssociatedToActor(() => this.selectedActorId()), validateIfDomainExists()],
    ],
  });

  userInfo = this.nonNullableFormBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', [Validators.required]],
  });

  userRoles = this.nonNullableFormBuilder.group({
    selectedUserRoles: [[] as string[], Validators.required],
  });

  private emailChanged = toSignal(this.baseInfo.controls.email.valueChanges);
  private actorIdChanged = toSignal(this.baseInfo.controls.actorId.valueChanges);

  selectedActorId = signal<string | null>(null);

  doesUserExist = computed(() => !!this.doesEmailExist.data()?.emailExists);
  doesUserExistLoading = this.doesEmailExist.loading;

  constructor() {
    super();

    effect(() => {
      const actors = this.actors();

      if (actors.length === 1) {
        const [firstActor] = actors;
        this.baseInfo.controls.actorId.setValue(firstActor.id);
      }
    });

    effect(() => {
      const actorId = this.actorIdChanged();

      actorId !== null
        ? this.baseInfo.controls.email.enable()
        : this.baseInfo.controls.email.disable();

      if (!actorId) return;

      this.selectedActorId.set(actorId);
      this.baseInfo.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    });

    effect(() => {
      const emailChanged = this.emailChanged();

      if (this.baseInfo.controls.email.invalid) return;

      this.doesEmailExist.query({ variables: { email: emailChanged } });
    });
  }

  async inviteUser() {
    if (this.baseInfo.invalid || !this.isNewUserInfoValid() || this.userRoles.invalid) {
      return;
    }

    const { email, actorId } = this.baseInfo.getRawValue();

    const result = await this.inviteUserMutation.mutate({
      variables: {
        input: {
          userInviteDto: {
            invitationUserDetails: this.createInvitationUserDetails(),
            email,
            assignedActor: actorId,
            assignedRoles: this.userRoles.controls.selectedUserRoles.value,
          },
        },
      },
    });

    if (result.data?.inviteUser.success) {
      this.onInviteSuccess(email);
    }

    if (result.error?.graphQLErrors || result.data?.inviteUser.errors) {
      this.onInviteError(result.error?.graphQLErrors, result.data?.inviteUser.errors);
    }
  }

  onSelectedUserRoles(userRoles: UserRoleItem[]) {
    this.userRoles.controls.selectedUserRoles.markAsTouched();
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  close(status: boolean) {
    this.modal().close(status);
  }

  private createInvitationUserDetails() {
    const { firstName, lastName, phoneNumber } = this.userInfo.value;

    if (!firstName || !lastName || !phoneNumber) return null;

    const phoneParts = phoneNumber.split(' ');
    const [prefix, ...rest] = phoneParts;
    const formattedPhoneNumber = `${prefix} ${rest.join('')}`;

    return {
      firstName,
      lastName,
      phoneNumber: formattedPhoneNumber,
    };
  }

  private onInviteSuccess(email: string | null) {
    this.toastService.open({
      type: 'success',
      message: `${this.translocoService.translate(
        'admin.userManagement.inviteUser.successMessage',
        { email: email }
      )}`,
    });

    this.close(true);
  }

  private onInviteError(
    errors: readonly GraphQLFormattedError[] | undefined,
    apiErrors: ApiErrorCollection[] | undefined | null
  ) {
    let message = this.translocoService.translate(
      'admin.userManagement.inviteUser.serverErrors.generalError'
    );

    if (errors) {
      message = parseGraphQLErrorResponse(errors) ?? message;
    }

    if (apiErrors) {
      message = readApiErrorResponse(apiErrors) ?? message;
    }

    this.toastService.open({ type: 'danger', message, duration: 60_000 });
  }

  private isNewUserInfoValid() {
    return this.userInfo.valid || this.doesUserExist() || !this.inOrganizationMailDomain();
  }
}
