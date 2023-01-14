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
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@rx-angular/template';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import { WattValidationMessageModule } from '@energinet-datahub/watt/validation-message';
import { DhCreateUserroleMasterdataTabComponent } from './create-role-masterdata-tab/dh-create-userrole-masterdata-tab.component';
import { DhCreateUserrolePermissionsTabComponent } from './create-role-permissions-tab/dh-create-userrole-permissions-tab.component';
import { DhAdminUserRolesManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { provideComponentStore } from '@ngrx/component-store';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { EicFunction, UserRoleDto } from '@energinet-datahub/dh/shared/domain';
import { Router } from '@angular/router';
import {
  dhAdminPath,
  dhAdminUserManagementPath,
} from '@energinet-datahub/dh/admin/routing';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { ObservedValueOf } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { UserRoleInfoDto } from '../../../../../../shared/domain/src/lib/generated/v1/model/user-role-info-dto';

interface CreateRoleForm {
  masterData?: ObservedValueOf<
    DhCreateUserroleMasterdataTabComponent['formReady']
  >;
}
@Component({
  selector: 'dh-create-userrole-tabs',
  standalone: true,
  templateUrl: './dh-create-userrole-tabs.component.html',
  providers: [
    provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore),
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
  ],
})
export class DhCreateUserroleTabsComponent implements OnInit {
  private readonly store = inject(DhAdminUserRolesManagementDataAccessApiStore);
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;
  validation$ = this.store.validation$;
  roleChanges$ = this.store.roleChanges$;
  createRoleForm = this.fb.group<CreateRoleForm>({});
  userRole?: UserRoleDto;

  onEicFunctionSelected = (eic: EicFunction) => {
    console.log(eic);
  };

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userRole = { name: '', description: '', id: '', eicFunction: 'Agent', status: 'Active' };
  }

  private readonly backToOverview = () => {
    const url = this.router.createUrlTree([
      dhAdminPath,
      dhAdminUserManagementPath,
    ]);

    this.router.navigateByUrl(url);
  };

  onSubmit() {
    if (!this.userRole) throw new Error("Missing user");
    Object.assign(this.roleChanges$, this.userRole)
    this.store.save(this.backToOverview);
  }


  addChildForm<K extends keyof CreateRoleForm>(
    name: K,
    group: Exclude<CreateRoleForm[K], undefined>
  ) {
    this.createRoleForm.setControl(name, group);
  }

  patchUserRole(patch: Partial<UserRoleDto>) {
    if (!this.userRole) throw new Error("Missing user");
    console.log(patch);
    this.userRole = { ...this.userRole, ...patch };
  }
}
