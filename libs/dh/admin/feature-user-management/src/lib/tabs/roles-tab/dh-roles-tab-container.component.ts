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
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { LetModule, PushModule } from '@rx-angular/template';

import { DhAdminUserRolesManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { DhUserRolesTabComponent } from './dh-roles-tab.component';
import { DhTabDataGeneralErrorComponent } from '../general-error/dh-tab-data-general-error.component';

@Component({
  selector: 'dh-roles-tab-container',
  standalone: true,
  templateUrl: './dh-roles-tab-container.component.html',
  styles: [
    `
      :host {
        background-color: var(--watt-color-neutral-white);
        display: block;
      }

      .user-roles {
        &__spinner {
          display: flex;
          justify-content: center;
          padding: var(--watt-space-l) 0;
        }

        &__error {
          padding: var(--watt-space-xl) 0;
        }
      }
    `,
  ],
  providers: [
    provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore),
  ],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    WattSpinnerModule,
    DhUserRolesTabComponent,
    DhTabDataGeneralErrorComponent,
  ],
})
export class DhRolesTabContainerComponent {
  private readonly store = inject(DhAdminUserRolesManagementDataAccessApiStore);
  roles$ = this.store.roles$;

  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  reloadRoles(): void {
    this.store.getRoles();
  }
}
