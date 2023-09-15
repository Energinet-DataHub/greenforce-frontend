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
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subscription, tap } from 'rxjs';

import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WATT_STEPPER, WattStepperComponent } from '@energinet-datahub/watt/stepper';
import {
  DhAdminAssignableUserRolesStore,
  DhUserActorsDataAccessApiStore,
  DhAdminInviteUserStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import { DhAssignableUserRolesComponent } from './dh-assignable-user-roles/dh-assignable-user-roles.component';
import { MarketParticipantUserRoleDto } from '@energinet-datahub/dh/shared/domain';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { danishPhoneNumberPattern } from '@energinet-datahub/dh/admin/domain';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DhAdminAssignableUserRolesStore, DhAdminInviteUserStore],
  selector: 'dh-invite-user-modal',
  templateUrl: './dh-invite-user-modal.component.html',
  styleUrls: ['./dh-invite-user-modal.component.scss'],
  standalone: true,
  imports: [
    WATT_MODAL,
    WattButtonComponent,
    TranslocoModule,
    WattIconComponent,
    CommonModule,
    ReactiveFormsModule,
    WattDropdownComponent,
    RxPush,
    DhAssignableUserRolesComponent,
    WATT_STEPPER,
    WattTextFieldComponent,
    WattFieldErrorComponent,
  ],
})
export class DhInviteUserModalComponent implements AfterViewInit, OnDestroy {
  private readonly actorStore = inject(DhUserActorsDataAccessApiStore);
  private readonly assignableUserRolesStore = inject(DhAdminAssignableUserRolesStore);
  private readonly inviteUserStore = inject(DhAdminInviteUserStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly translocoService = inject(TranslocoService);

  @ViewChild('inviteUserModal') inviteUserModal!: WattModalComponent;
  @ViewChild('stepper') stepper!: WattStepperComponent;
  @Output() closed = new EventEmitter<void>();

  readonly actorOptions$ = this.actorStore.actors$;
  domain: string | undefined = undefined;
  readonly organizationDomain$ = this.actorStore.organizationDomain$.pipe(
    tap((domain) => (this.domain = domain))
  );

  isInvitingUser$ = this.inviteUserStore.isSaving$;
  actorIdSubscription: Subscription | null = null;

  userInfo = this.formBuilder.group({
    actorId: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+')],
    ],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(12),
        Validators.minLength(12),
        Validators.pattern(danishPhoneNumberPattern),
      ],
    ],
  });
  userRoles = this.formBuilder.group({
    selectedUserRoles: [[] as string[], Validators.required],
  });

  ngAfterViewInit(): void {
    this.inviteUserModal.open();
    this.actorIdSubscription = this.userInfo.controls.actorId.valueChanges.subscribe((actorId) => {
      actorId !== null
        ? this.userInfo.controls.email.enable()
        : this.userInfo.controls.email.disable();

      if (actorId === null) {
        this.actorStore.resetOrganizationState();
        return;
      }
      this.assignableUserRolesStore.getAssignableUserRoles(actorId);
      this.actorStore.getActorOrganization(actorId);
    });
  }

  ngOnDestroy(): void {
    this.actorIdSubscription?.unsubscribe();
  }

  inviteUser() {
    if (this.userInfo.valid === false || this.userRoles.valid === false) {
      return;
    }

    const { firstname, lastname, email, phoneNumber, actorId } = this.userInfo.controls;

    const emailWithDomain = `${email.value}@${this.domain}`;

    this.inviteUserStore.inviteUser({
      invitation: {
        firstName: firstname.value ?? '',
        lastName: lastname.value ?? '',
        email: emailWithDomain,
        phoneNumber: phoneNumber.value ?? '',
        assignedActor: actorId.value ?? '',
        assignedRoles: this.userRoles.controls.selectedUserRoles.value ?? [],
      },
      onSuccess: () => {
        this.toastService.open({
          type: 'success',
          message: `${this.translocoService.translate(
            'admin.userManagement.inviteUser.successMessage',
            { email: emailWithDomain }
          )}`,
        });
        this.closeModal(true);
      },
      onError: (e) => {
        this.toastService.open({
          type: 'danger',
          message: e
            .map((x) =>
              this.translocoService.translate(
                `admin.userManagement.inviteUser.serverErrors.${x.code}`
              )
            )
            .join('\n'),
          duration: 600000,
        });
      },
    });
  }

  onSelectedUserRoles(userRoles: MarketParticipantUserRoleDto[]) {
    this.userRoles.controls.selectedUserRoles.markAsTouched();
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  closeModal(status: boolean) {
    this.closed.emit();
    this.actorStore.resetOrganizationState();
    this.inviteUserModal.close(status);
  }
}
