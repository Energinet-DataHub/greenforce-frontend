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
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import { WattValidationMessageModule } from '@energinet-datahub/watt/validation-message';
import { DhCreateUserroleMasterdataTabComponent } from './create-role-masterdata-tab/dh-create-userrole-masterdata-tab.component';
import { DhCreateUserrolePermissionsTabComponent } from './create-role-permissions-tab/dh-create-userrole-permissions-tab.component';
import { DhAdminCreateUserRoleManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { provideComponentStore } from '@ngrx/component-store';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import {
  CreateUserRoleDto,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain';
import { Router } from '@angular/router';
import {
  dhAdminPath,
  dhAdminUserManagementPath,
} from '@energinet-datahub/dh/admin/routing';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { ObservedValueOf, Subject, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WattToastService } from '@energinet-datahub/watt/toast';

interface CreateRoleForm {
  masterData?: ObservedValueOf<
    DhCreateUserroleMasterdataTabComponent['formReady']
  >;
}
@Component({
  selector: 'dh-create-userrole-tabs',
  standalone: true,
  templateUrl: './dh-create-userrole-tabs.component.html',
  styleUrls: ['./dh-create-userrole-tabs.component.scss'],
  providers: [
    provideComponentStore(DhAdminCreateUserRoleManagementDataAccessApiStore),
  ],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    CommonModule,
    PushModule,
    LetModule,
    WattTabsModule,
    WattValidationMessageModule,
    DhCreateUserroleMasterdataTabComponent,
    DhCreateUserrolePermissionsTabComponent,
    WattCardModule,
    WattSpinnerModule,
    WattButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class DhCreateUserroleTabsComponent implements OnInit, OnDestroy {
  private readonly store = inject(
    DhAdminCreateUserRoleManagementDataAccessApiStore
  );
  isLoading$ = this.store.isLoading$;
  createRoleForm = this.formBuilder.group<CreateRoleForm>({});
  userRole: CreateUserRoleDto;
  selectablePermissions$ = this.store.selectablePermissions$;
  canSelectPermissions = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: WattToastService,
    private translocoService: TranslocoService
  ) {
    this.userRole = {
      name: '',
      description: '',
      eicFunction: EicFunction.BalanceResponsibleParty,
      status: 'Active',
      permissions: [],
    };
  }

  ngOnInit(): void {
    this.store.hasGeneralError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasError) => {
        if (hasError) {
          this.toastService.open({
            message: this.translocoService.translate(
              'admin.userManagement.createrole.createRoleRequest.error'
            ),
            type: 'danger',
          });

          this.createRoleForm.enable();
        }
      });

    this.store.getSelectablePermissions(this.userRole.eicFunction);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    if (!this.userRole) throw new Error('Missing user role');
    this.createRoleForm.disable();
    this.store.createUserRole({
      createRole: this.userRole,
      onSaveCompletedFn: this.backToOverviewAfterSave,
    });

    this.toastService.open({
      message: this.translocoService.translate(
        'admin.userManagement.createrole.createRoleRequest.start'
      ),
      type: 'loading',
    });
  }

  addChildForm<K extends keyof CreateRoleForm>(
    name: K,
    group: Exclude<CreateRoleForm[K], undefined>
  ) {
    this.createRoleForm.setControl(name, group);
  }

  patchUserRole(patch: Partial<CreateUserRoleDto>) {
    if (!this.userRole) throw new Error('Missing user role');
    this.userRole = { ...this.userRole, ...patch };
  }

  eicFunctionSelected(eicFunction: EicFunction) {
    this.patchUserRole({ permissions: [] });
    this.store.getSelectablePermissions(eicFunction);
  }

  private readonly backToOverviewAfterSave = () => {
    this.toastService.open({
      message: this.translocoService.translate(
        'admin.userManagement.createrole.createRoleRequest.success'
      ),
      type: 'success',
    });

    const url = this.router.createUrlTree([
      dhAdminPath,
      dhAdminUserManagementPath,
    ]);

    this.router.navigateByUrl(url);
  };

  readonly backToOverview = () => {
    const url = this.router.createUrlTree([
      dhAdminPath,
      dhAdminUserManagementPath,
    ]);

    this.router.navigateByUrl(url);
  };
}
