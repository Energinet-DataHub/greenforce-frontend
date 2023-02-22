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
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { map, Subject, takeUntil } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import {
  DhAdminUserRoleEditDataAccessApiStore,
  DhAdminUserRoleWithPermissionsManagementDataAccessApiStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import {
  UpdateUserRoleDto,
  UserRoleWithPermissionsDto,
} from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-edit-user-role-modal',
  templateUrl: './dh-edit-user-role-modal.component.html',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      .form-wrapper {
        padding-top: var(--watt-space-l);
        width: 25rem;
      }
    `,
  ],
  providers: [DhAdminUserRoleEditDataAccessApiStore],
  imports: [
    CommonModule,
    PushModule,
    LetModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabsModule,
    WattFormFieldModule,
    WattInputModule,
    ReactiveFormsModule,
  ],
})
export class DhEditUserRoleModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly userRoleEditStore = inject(
    DhAdminUserRoleEditDataAccessApiStore
  );
  private readonly userRoleWithPermissionsStore = inject(
    DhAdminUserRoleWithPermissionsManagementDataAccessApiStore
  );
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  private destroy$ = new Subject<void>();

  readonly userRole$ = this.userRoleWithPermissionsStore.userRole$;
  readonly roleName$ = this.userRole$.pipe(map((role) => role.name));

  readonly isLoading$ = this.userRoleEditStore.isLoading$;
  readonly hasValidationError$ = this.userRoleEditStore.hasValidationError$;

  readonly userRoleEditForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required]),
    description: this.formBuilder.nonNullable.control('', [
      Validators.required,
    ]),
  });

  @ViewChild(WattModalComponent) editUserRoleModal!: WattModalComponent;

  @Output() closed = new EventEmitter<{ saveSuccess: boolean }>();

  ngOnInit(): void {
    const formControls = this.userRoleEditForm.controls;

    this.userRole$.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
      formControls.name.setValue(userRole.name);
      formControls.description.setValue(userRole.description);
    });

    this.hasValidationError$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      formControls.name.setErrors({
        nameAlreadyExists: true,
      });
    });
  }

  ngAfterViewInit(): void {
    this.editUserRoleModal.open();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal(saveSuccess: boolean): void {
    this.editUserRoleModal.close(saveSuccess);
    this.closed.emit({ saveSuccess });
  }

  save(userRole: UserRoleWithPermissionsDto): void {
    const formControls = this.userRoleEditForm.controls;

    const updatedUserRole: UpdateUserRoleDto = {
      name: formControls.name.value,
      description: formControls.description.value,
      status: userRole.status,
      permissions: userRole.permissions.map((permissions) => permissions.id),
    };

    const onSuccessFn = () => {
      const message = this.transloco.translate(
        'admin.userManagement.editUserRole.saveSuccess'
      );

      this.toastService.open({ type: 'success', message });
      this.closeModal(true);
    };

    const onErrorFn = (statusCode: HttpStatusCode) => {
      if (statusCode !== HttpStatusCode.BadRequest) {
        const message = this.transloco.translate(
          'admin.userManagement.editUserRole.saveError'
        );

        this.toastService.open({ type: 'danger', message });
      }
    };

    this.userRoleEditStore.updateUserRole({
      userRoleId: userRole.id,
      updatedUserRole,
      onSuccessFn,
      onErrorFn,
    });
  }
}
