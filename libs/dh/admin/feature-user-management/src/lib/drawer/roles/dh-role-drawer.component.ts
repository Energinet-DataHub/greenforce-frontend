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
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';

import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { UserRoleDto } from '@energinet-datahub/dh/shared/domain';
import { DhAdminUserRoleWithPermissionsManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { DhEditUserRoleModalComponent } from '@energinet-datahub/dh/admin/feature-edit-user-role-modal';

import { DhDrawerRoleTabsComponent } from './tabs/dh-drawer-role-tabs.component';
import { DhRoleStatusComponent } from '../../shared/dh-role-status.component';
import { DhTabDataGeneralErrorComponent } from '../../tabs/general-error/dh-tab-data-general-error.component';

@Component({
  selector: 'dh-role-drawer',
  standalone: true,
  templateUrl: './dh-role-drawer.component.html',
  styles: [
    `
      .role-name__grid {
        display: flex;
        align-items: center;
        gap: var(--watt-space-s);
        margin-bottom: 28px; /* Magic UX number */
      }

      .role-name__headline {
        margin: 0;
      }

      .user-role {
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
    provideComponentStore(
      DhAdminUserRoleWithPermissionsManagementDataAccessApiStore
    ),
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    WattDrawerModule,
    WattButtonModule,
    DhRoleStatusComponent,
    DhDrawerRoleTabsComponent,
    PushModule,
    LetModule,
    WattSpinnerModule,
    DhTabDataGeneralErrorComponent,
    DhEditUserRoleModalComponent,
  ],
})
export class DhRoleDrawerComponent {
  private readonly store = inject(
    DhAdminUserRoleWithPermissionsManagementDataAccessApiStore
  );

  userRoleWithPermissions$ = this.store.userRole$;

  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  basicUserRole: UserRoleDto | null = null;

  isEditUserRoleModalVisible = false;

  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.basicUserRole = null;
  }

  open(role: UserRoleDto): void {
    this.basicUserRole = role;
    this.drawer.open();
    this.loadUserRoleWithPermissions();
  }

  loadUserRoleWithPermissions() {
    if (this.basicUserRole) {
      this.store.getUserRole(this.basicUserRole.id);
    }
  }
}
