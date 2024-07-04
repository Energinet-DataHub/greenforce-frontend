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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { distinctUntilChanged, map, of, take } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';

import {
  DhUserActorsDataAccessApiStore,
  DhAdminInviteUserStore,
  UserRoleItem,
} from '@energinet-datahub/dh/admin/data-access-api';

import {
  GetAssociatedActorsDocument,
  GetKnownEmailsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { DhAssignableUserRolesComponent } from './dh-assignable-user-roles/dh-assignable-user-roles.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [DhAdminInviteUserStore],
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
export class DhInviteUserModalComponent implements AfterViewInit {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(WattToastService);
  private readonly changeDectorRef = inject(ChangeDetectorRef);
  private readonly translocoService = inject(TranslocoService);
  private readonly inviteUserStore = inject(DhAdminInviteUserStore);
  private readonly actorStore = inject(DhUserActorsDataAccessApiStore);
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);

  private readonly userEmailExistsQuery = this.apollo.watchQuery({
    returnPartialData: false,
    useInitialLoading: false,
    query: GetKnownEmailsDocument,
  });

  @ViewChild('inviteUserModal') inviteUserModal!: WattModalComponent;
  @Output() closed = new EventEmitter<void>();

  readonly actors$ = this.actorStore.actors$;

  isInvitingUser$ = this.inviteUserStore.isSaving$;

  selectedActorId = signal<string | null>(null);

  domain: string | undefined = undefined;
  inOrganizationMailDomain = false;
  emailExists = false;
  knownEmails: string[] = [];
  isLoadingEmails = true;
  checkingForAssociatedActors = signal(false);

  baseInfo = this.nonNullableFormBuilder.group({
    actorId: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
      [
        (control) => {
          if (control.value) {
            this.checkingForAssociatedActors.set(true);

            return this.apollo
              .query({
                query: GetAssociatedActorsDocument,
                variables: {
                  email: control.value,
                },
              })
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                map((result) => {
                  this.checkingForAssociatedActors.set(false);

                  const associatedActors = result.data?.associatedActors.actors ?? [];

                  const isAlreadyAssociatedToActor = associatedActors?.includes(
                    this.baseInfo.controls.actorId.value ?? ''
                  );

                  return isAlreadyAssociatedToActor ? { userAlreadyAssignedActor: true } : null;
                })
              );
          }

          return of(null);
        },
      ],
    ],
  });

  userInfo = this.nonNullableFormBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    phoneNumber: ['', [Validators.required]],
  });
  userRoles = this.nonNullableFormBuilder.group({
    selectedUserRoles: [[] as string[], Validators.required],
  });

  ngAfterViewInit(): void {
    this.inviteUserModal.open();

    this.userEmailExistsQuery.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((x) => {
        this.knownEmails = x.data?.knownEmails?.map((x) => x.toUpperCase()) ?? [];
        this.isLoadingEmails = false;
        this.changeDectorRef.detectChanges();
      });

    this.baseInfo.controls.actorId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((actorId) => {
        actorId !== null
          ? this.baseInfo.controls.email.enable()
          : this.baseInfo.controls.email.disable();

        if (actorId === null) {
          this.actorStore.resetOrganizationState();
          return;
        }
        this.selectedActorId.set(actorId);
        this.actorStore.getActorOrganization(actorId);
        this.baseInfo.updateValueAndValidity();
        this.changeDectorRef.detectChanges();
      });

    this.actorStore.organizationDomain$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((domain) => {
        this.domain = domain;
      });

    this.baseInfo.controls.email.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((email) => {
        this.inOrganizationMailDomain =
          !!email && !!this.domain && email.toUpperCase().endsWith(this.domain.toUpperCase());

        this.emailExists = !!email && this.knownEmails.includes(email.toUpperCase());

        this.changeDectorRef.detectChanges();
      });

    this.actors$.pipe(take(1)).subscribe((actors) => {
      if (actors.length === 1) {
        this.baseInfo.controls.actorId.setValue(actors[0].value);
      }
    });
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

    this.inviteUserStore.inviteUser({
      invitation: {
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
      onSuccess: () => this.onInviteSuccess(email.value),
      onError: (e) => this.onInviteError(e),
    });
  }

  onSelectedUserRoles(userRoles: UserRoleItem[]) {
    this.userRoles.controls.selectedUserRoles.markAsTouched();
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  closeModal(status: boolean) {
    this.closed.emit();
    this.actorStore.resetOrganizationState();
    this.inviteUserModal.close(status);
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
