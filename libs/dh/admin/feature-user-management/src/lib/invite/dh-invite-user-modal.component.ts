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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { RxPush } from '@rx-angular/template/push';
import { of } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattModalComponent, WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';

import { lazyQuery, mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { UserRoleItem } from '@energinet-datahub/dh/admin/data-access-api';

import {
  GetKnownEmailsDocument,
  GetFilteredActorsDocument,
  GetAssociatedActorsDocument,
  InviteUserDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { DhAssignableUserRolesComponent } from './dh-assignable-user-roles/dh-assignable-user-roles.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'dh-invite-user-modal',
  templateUrl: './dh-invite-user-modal.component.html',
  styleUrls: ['./dh-invite-user-modal.component.scss'],
  standalone: true,
  imports: [
    RxPush,
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WATT_STEPPER,
    WattIconComponent,
    WattButtonComponent,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattPhoneFieldComponent,

    DhAssignableUserRolesComponent,
  ],
})
export class DhInviteUserModalComponent extends WattTypedModal {
  private readonly toastService = inject(WattToastService);
  private readonly changeDectorRef = inject(ChangeDetectorRef);
  private readonly translocoService = inject(TranslocoService);
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);

  inviteUserModal = viewChild.required<WattModalComponent>('inviteUserModal');
  closed = output<void>();

  inviteUserMutation = mutation(InviteUserDocument);

  isInvitingUser = this.inviteUserMutation.loading;

  selectedActorId = signal<string | null>(null);

  actors = query(GetFilteredActorsDocument);

  actorOptions = computed<WattDropdownOptions>(() =>
    (this.actors.data()?.filteredActors ?? []).map((actor) => ({
      displayValue: actor.displayName,
      value: actor.id,
    }))
  );

  domain = computed(
    () =>
      this.actors.data()?.filteredActors.find((x) => x.id === this.selectedActorId())?.organization
        .domain
  );

  inOrganizationMailDomain = computed(() => {
    const email = this.emailChanged();
    const domain = this.domain();
    return !!email && !!domain && email.toUpperCase().endsWith(domain.toUpperCase());
  });

  emailExists = computed(() => {
    const email = this.emailChanged();
    return !!email && this.knownEmails().includes(email.toUpperCase());
  });

  knownEmailsQuery = query(GetKnownEmailsDocument);

  knownEmails = computed(
    () => this.knownEmailsQuery.data()?.knownEmails.map((x) => x.toUpperCase()) ?? []
  );

  isLoadingEmails = computed(() => this.knownEmailsQuery.loading());
  checkingForAssociatedActors = computed(() => this.checkForAssociatedActors.loading());
  checkForAssociatedActors = lazyQuery(GetAssociatedActorsDocument);

  baseInfo = this.nonNullableFormBuilder.group({
    actorId: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
      [
        (control) => {
          if (control.value) {
            this.checkForAssociatedActors
              .query({ variables: { email: control.value } })
              .then((result) => {
                const associatedActors = result.data?.associatedActors.actors ?? [];

                const isAlreadyAssociatedToActor = associatedActors?.includes(
                  this.baseInfo.controls.actorId.value ?? ''
                );

                return isAlreadyAssociatedToActor ? { userAlreadyAssignedActor: true } : null;
              });
          }

          return of(null);
        },
      ],
    ],
  });

  emailChanged = toSignal(this.baseInfo.controls.email.valueChanges);

  actorIdChanged = toSignal(this.baseInfo.controls.actorId.valueChanges);

  userInfo = this.nonNullableFormBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    phoneNumber: ['', [Validators.required]],
  });

  userRoles = this.nonNullableFormBuilder.group({
    selectedUserRoles: [[] as string[], Validators.required],
  });

  constructor() {
    super();
    effect(() => {
      const actors = this.actors.data()?.filteredActors;
      if (actors !== undefined && actors.length === 1) {
        const [firstActor] = actors;
        this.baseInfo.controls.actorId.setValue(firstActor.id);
      }
    });

    effect(
      () => {
        const actorId = this.actorIdChanged();
        actorId !== null
          ? this.baseInfo.controls.email.enable()
          : this.baseInfo.controls.email.disable();

        if (!actorId) return;

        this.selectedActorId.set(actorId);
        this.baseInfo.updateValueAndValidity();
        this.changeDectorRef.detectChanges();
      },
      { allowSignalWrites: true }
    );
  }

  inviteUser() {
    if (!this.isBaseInfoValid() || !this.isNewUserInfoValid() || !this.isRolesInfoValid()) {
      return;
    }

    const { firstname, lastname, phoneNumber } = this.userInfo.controls;
    const { email, actorId } = this.baseInfo.controls;

    const phoneParts = phoneNumber.value.split(' ');
    const [prefix, ...rest] = phoneParts;
    const formattedPhoneNumber = `${prefix} ${rest.join('')}`;

    this.inviteUserMutation
      .mutate({
        variables: {
          input: {
            userInviteDto: {
              invitationUserDetails:
                firstname.value && lastname.value && phoneNumber.value
                  ? {
                      firstName: firstname.value,
                      lastName: lastname.value,
                      phoneNumber: formattedPhoneNumber,
                    }
                  : undefined,
              email: email.value,
              assignedActor: actorId.value,
              assignedRoles: this.userRoles.controls.selectedUserRoles.value,
            },
          },
        },
      })
      .then(() => this.onInviteSuccess(email.value))
      .catch((e) => this.onInviteError(e));
  }

  onSelectedUserRoles(userRoles: UserRoleItem[]) {
    this.userRoles.controls.selectedUserRoles.markAsTouched();
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  closeModal(status: boolean) {
    this.closed.emit();
    this.inviteUserModal().close(status);
  }

  private onInviteSuccess(email: string | null) {
    this.toastService.open({
      type: 'success',
      message: `${this.translocoService.translate(
        'admin.userManagement.inviteUser.successMessage',
        { email: email }
      )}`,
    });
    this.closeModal(true);
  }

  private onInviteError(apiErrorCollection: ApiErrorCollection) {
    const message =
      apiErrorCollection.apiErrors.length > 0
        ? readApiErrorResponse([apiErrorCollection])
        : this.translocoService.translate(
            'admin.userManagement.inviteUser.serverErrors.generalError'
          );

    this.toastService.open({ type: 'danger', message, duration: 60_000 });
  }

  private isBaseInfoValid() {
    return this.baseInfo.valid;
  }

  private isNewUserInfoValid() {
    return this.userInfo.valid || this.emailExists || !this.inOrganizationMailDomain;
  }

  private isRolesInfoValid() {
    return this.userRoles.valid;
  }
}
