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
import { combineLatest, map, Subject, takeUntil, tap } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattModalComponent, WattModalModule } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattCardModule } from '@energinet-datahub/watt/card';
import {
  DhAdminMarketRolePermissionsStore,
  DhAdminUserRoleEditDataAccessApiStore,
  DhAdminUserRoleWithPermissionsManagementDataAccessApiStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import {
  PermissionDetailsDto,
  UpdateUserRoleDto,
  UserRoleWithPermissionsDto,
} from '@energinet-datahub/dh/shared/domain';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/ui-permissions-table';

@Component({
  selector: 'dh-edit-user-role-modal',
  templateUrl: './dh-edit-user-role-modal.component.html',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      .tabMasterData {
        margin: calc(var(--watt-space-ml) * 2) 0 0 var(--watt-space-ml);
        width: 25rem;
      }

      .tabPermissions {
        margin: 0 var(--watt-space-ml);
      }

      .spinner-container {
        display: flex;
        justify-content: center;
        margin-top: var(--watt-space-m);
      }
    `,
  ],
  providers: [DhAdminUserRoleEditDataAccessApiStore, DhAdminMarketRolePermissionsStore],
  imports: [
    CommonModule,
    PushModule,
    LetModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabComponent,
    WattTabsComponent,
    WattFormFieldModule,
    WattInputModule,
    ReactiveFormsModule,
    WattSpinnerModule,
    WattCardModule,
    DhPermissionsTableComponent,
  ],
})
export class DhEditUserRoleModalComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly userRoleEditStore = inject(DhAdminUserRoleEditDataAccessApiStore);
  private readonly userRoleWithPermissionsStore = inject(
    DhAdminUserRoleWithPermissionsManagementDataAccessApiStore
  );
  private readonly marketRolePermissionsStore = inject(DhAdminMarketRolePermissionsStore);

  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  private skipFirstPermissionSelectionEvent = true;
  private destroy$ = new Subject<void>();

  readonly userRole$ = this.userRoleWithPermissionsStore.userRole$;
  readonly roleName$ = this.userRole$.pipe(map((role) => role.name));

  readonly marketRolePermissions$ = this.marketRolePermissionsStore.permissions$;
  readonly initiallySelectedPermissions$ = combineLatest([
    this.marketRolePermissions$,
    this.userRole$,
  ]).pipe(
    map(([marketRolePermissions, userRole]) => {
      return marketRolePermissions.filter((marketRolePermission) => {
        return userRole.permissions.some(
          (userRolePermission) => userRolePermission.id === marketRolePermission.id
        );
      });
    }),
    tap((initiallySelectedPermissions) => {
      this.skipFirstPermissionSelectionEvent = initiallySelectedPermissions.length > 0;
    })
  );
  readonly marketRolePermissionsIsLoading$ = this.marketRolePermissionsStore.isLoading$;

  readonly isLoading$ = this.userRoleEditStore.isLoading$;
  readonly hasValidationError$ = this.userRoleEditStore.hasValidationError$;

  readonly userRoleEditForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required]),
    description: this.formBuilder.nonNullable.control('', [Validators.required]),
    permissionIds: this.formBuilder.nonNullable.control<number[]>([], [Validators.required]),
  });

  @ViewChild(WattModalComponent) editUserRoleModal!: WattModalComponent;

  @Output() closed = new EventEmitter<{ saveSuccess: boolean }>();

  ngOnInit(): void {
    this.userRole$.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
      const permissionIds = userRole.permissions.map(({ id }) => id);

      this.userRoleEditForm.patchValue({
        name: userRole.name,
        description: userRole.description,
        permissionIds,
      });

      this.marketRolePermissionsStore.getPermissions(userRole.eicFunction);
    });

    this.hasValidationError$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.userRoleEditForm.controls.name.setErrors({
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

  onSelectionChanged(selectedPermissions: PermissionDetailsDto[]): void {
    if (this.skipFirstPermissionSelectionEvent) {
      this.skipFirstPermissionSelectionEvent = false;

      return;
    }

    const permissionIds = selectedPermissions.map(({ id }) => id);

    this.userRoleEditForm.patchValue({ permissionIds });
    this.userRoleEditForm.markAsDirty();
  }

  save(userRole: UserRoleWithPermissionsDto): void {
    if (this.userRoleEditForm.invalid) {
      return;
    }

    if (this.userRoleEditForm.pristine) {
      this.closeModal(false);
    }

    const formControls = this.userRoleEditForm.controls;

    const updatedUserRole: UpdateUserRoleDto = {
      name: formControls.name.value,
      description: formControls.description.value,
      permissions: formControls.permissionIds.value,
      status: userRole.status,
    };

    const onSuccessFn = () => {
      const message = this.transloco.translate('admin.userManagement.editUserRole.saveSuccess');

      this.toastService.open({ type: 'success', message });
      this.closeModal(true);
    };

    const onErrorFn = (statusCode: HttpStatusCode) => {
      if (statusCode !== HttpStatusCode.BadRequest) {
        const message = this.transloco.translate('admin.userManagement.editUserRole.saveError');

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
