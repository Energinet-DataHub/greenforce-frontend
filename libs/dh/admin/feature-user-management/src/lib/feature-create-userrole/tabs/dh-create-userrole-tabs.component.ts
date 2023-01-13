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
import { Component, inject } from '@angular/core';
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
import { EicFunction } from '@energinet-datahub/dh/shared/domain';

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
  ],
})
export class DhCreateUserroleTabsComponent {
  private readonly store = inject(DhAdminUserRolesManagementDataAccessApiStore);
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;
  validation$ = this.store.validation$;
  roleChanges$ = this.store.roleChanges$;

  onEicFunctionSelected = (eic: EicFunction) => {
    console.log(eic);
  };
}
