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
import { provideComponentStore } from '@ngrx/component-store';
import { LetModule, PushModule } from '@rx-angular/template';
import { PageEvent } from '@angular/material/paginator';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattCardModule } from '@energinet-datahub/watt/card';

import { DhUsersTabGeneralErrorComponent } from './general-error/dh-users-tab-general-error.component';
import { DhUsersTabTableComponent } from './dh-users-tab-table.component';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import {
  WattDropdownModule,
  WattDropdownOption,
} from '@energinet-datahub/watt/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dh-users-tab',
  standalone: true,
  templateUrl: './dh-users-tab.component.html',
  styles: [
    `
      :host {
        display: block;
        /* TODO: Add spacing variable for 24px */
        margin: 24px var(--watt-space-s);
      }

      .filter-container {
        display: inline-flex;
      }

      .users-overview {
        &__spinner {
          display: flex;
          justify-content: center;
          padding: var(--watt-space-l) 0;
        }

        &__error {
          padding: var(--watt-space-xl) 0;
        }
      }

      h4 {
        margin: 0;
      }

      .card-title__container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
  providers: [provideComponentStore(DhAdminUserManagementDataAccessApiStore)],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    FormsModule,
    TranslocoModule,
    WattSpinnerModule,
    WattCardModule,
    WattFormFieldModule,
    WattDropdownModule,
    DhUsersTabTableComponent,
    DhSharedUiPaginatorComponent,
    DhUsersTabGeneralErrorComponent,
  ],
})
export class DhUsersTabComponent {
  users$ = this.store.users$;
  totalUserCount$ = this.store.totalUserCount$;

  pageIndex$ = this.store.paginatorPageIndex$;
  pageSize$ = this.store.pageSize$;

  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  filter = this.store.filter;
  userStatusOptions: WattDropdownOption[] = [
    {
      value: 'Active',
      displayValue: this.trans.translate(
        'admin.userManagement.userStatus.active'
      ),
    },
    {
      value: 'Inactive',
      displayValue: this.trans.translate(
        'admin.userManagement.userStatus.inactive'
      ),
    },
  ];

  constructor(
    private store: DhAdminUserManagementDataAccessApiStore,
    private trans: TranslocoService
  ) {}

  onPageChange(event: PageEvent): void {
    this.store.updatePageMetadata({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  reloadUsers(): void {
    this.store.reloadUsers();
  }
}
