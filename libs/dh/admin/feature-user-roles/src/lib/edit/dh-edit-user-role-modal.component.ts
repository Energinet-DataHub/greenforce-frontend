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
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
  DestroyRef,
  viewChild,
  computed,
} from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { combineLatest, map, tap } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  DhAdminUserRoleEditDataAccessApiStore,
  DhUserRoleManagementStore,
  DhUserRoleWithPermissions,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/shared';
import {
  GetPermissionByEicFunctionDocument,
  PermissionDetailsDto,
  UpdateUserRoleDtoInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-edit-user-role-modal',
  templateUrl: './dh-edit-user-role-modal.component.html',
  standalone: true,
  styles: [
    `
      .tab-master-data {
        width: 25rem;
      }

      .spinner-container {
        display: flex;
        justify-content: center;
        margin-top: var(--watt-space-m);
      }
    `,
  ],
  providers: [DhAdminUserRoleEditDataAccessApiStore],
  imports: [
    RxPush,
    RxLet,
    WATT_MODAL,
    TranslocoDirective,
    ReactiveFormsModule,

    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattSpinnerComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WATT_CARD,
    WattTextAreaFieldComponent,

    DhPermissionsTableComponent,
  ],
})
export class DhEditUserRoleModalComponent implements OnInit, AfterViewInit {
  private readonly userRoleEditStore = inject(DhAdminUserRoleEditDataAccessApiStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userRoleWithPermissionsStore = inject(DhUserRoleManagementStore);

  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  private skipFirstPermissionSelectionEvent = true;

  readonly userRole$ = this.userRoleWithPermissionsStore.userRole$;
  readonly roleName$ = this.userRole$.pipe(map((role) => role.name));

  permissionsQuery = lazyQuery(GetPermissionByEicFunctionDocument);

  permissions = computed<PermissionDetailsDto[]>(
    () => this.permissionsQuery.data()?.permissionsByEicFunction ?? []
  );

  private readonly marketRolePermissions$ = toObservable(this.permissions);
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
  readonly marketRolePermissionsIsLoading = this.permissionsQuery.loading;

  readonly isLoading$ = this.userRoleEditStore.isLoading$;
  readonly hasValidationError$ = this.userRoleEditStore.hasValidationError$;

  readonly userRoleEditForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required]),
    description: this.formBuilder.nonNullable.control('', [Validators.required]),
    permissionIds: this.formBuilder.nonNullable.control<number[]>([], [Validators.required]),
  });

  @ViewChild(WattModalComponent) editUserRoleModal!: WattModalComponent;

  tabs = viewChild(WattTabsComponent);

  @Output() closed = new EventEmitter<{ saveSuccess: boolean }>();

  ngOnInit(): void {
    this.userRole$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((userRole) => {
      const permissionIds = userRole.permissions.map(({ id }) => id);

      this.userRoleEditForm.patchValue({
        name: userRole.name,
        description: userRole.description,
        permissionIds,
      });

      this.permissionsQuery.refetch({ eicFunction: userRole.eicFunction });
    });

    this.hasValidationError$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.userRoleEditForm.controls.name.setErrors({
        nameAlreadyExists: true,
      });
    });
  }

  ngAfterViewInit(): void {
    this.editUserRoleModal.open();
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

  save(userRole: DhUserRoleWithPermissions): void {
    if (this.userRoleEditForm.invalid) {
      if (this.userRoleEditForm.controls.description.hasError('required')) {
        this.tabs()?.setSelectedIndex(0);
      }
      return;
    }

    if (this.userRoleEditForm.pristine) {
      return this.closeModal(false);
    }

    const formControls = this.userRoleEditForm.controls;

    const updatedUserRole: UpdateUserRoleDtoInput = {
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
