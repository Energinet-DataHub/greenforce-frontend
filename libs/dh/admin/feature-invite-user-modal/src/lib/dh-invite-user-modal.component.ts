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
import { WattModalComponent, WattModalModule } from '@energinet-datahub/watt/modal';

import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template/push';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WattDropdownModule } from '@energinet-datahub/watt/dropdown';
import {
  WattStepperButtonNextDirective,
  WattStepperButtonPreviousDirective,
} from '@energinet-datahub/watt/stepper';
import { MatInputModule } from '@angular/material/input';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  DbAdminAssignableUserRolesStore,
  DhUserActorsDataAccessApiStore,
  DbAdminInviteUserStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import { DhAssignableUserRolesComponent } from './dh-assignable-user-roles/dh-assignable-user-roles.component';
import { Subscription, tap } from 'rxjs';
import { UserRoleDto } from '@energinet-datahub/dh/shared/domain';
import { WattToastService } from '@energinet-datahub/watt/toast';
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DbAdminAssignableUserRolesStore,
    DbAdminInviteUserStore,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  selector: 'dh-invite-user-modal',
  templateUrl: './dh-invite-user-modal.component.html',
  styleUrls: ['./dh-invite-user-modal.component.scss'],
  standalone: true,
  imports: [
    WattModalModule,
    MatStepperModule,
    WattButtonModule,
    WattStepperButtonNextDirective,
    WattStepperButtonPreviousDirective,
    TranslocoModule,
    MatDividerModule,
    WattIconModule,
    CommonModule,
    ReactiveFormsModule,
    WattInputModule,
    WattFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    WattDropdownModule,
    PushModule,
    DhAssignableUserRolesComponent,
  ],
})
export class DhInviteUserModalComponent implements AfterViewInit, OnDestroy {
  private readonly actorStore = inject(DhUserActorsDataAccessApiStore);
  private readonly assignableUserRolesStore = inject(DbAdminAssignableUserRolesStore);
  private readonly inviteUserStore = inject(DbAdminInviteUserStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly translocoService = inject(TranslocoService);

  @ViewChild('inviteUserModal') inviteUserModal!: WattModalComponent;
  @ViewChild('stepper') stepper!: MatStepper;
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
    email: [{ value: '', disabled: true }, Validators.required],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(12),
        Validators.minLength(12),
        Validators.pattern('^\\+[0-9]+ [0-9]+$'),
      ],
    ],
  });
  userRoles = this.formBuilder.group({
    selectedUserRoles: [[''], Validators.required],
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
    });
  }

  onSelectedUserRoles(userRoles: UserRoleDto[]) {
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  closeModal(status: boolean) {
    this.closed.emit();
    this.actorStore.resetOrganizationState();
    this.inviteUserModal.close(status);
  }
}
