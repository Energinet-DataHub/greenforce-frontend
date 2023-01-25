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
import { render, screen } from '@testing-library/angular';
import { DhUserAuditLogsComponent } from './dh-user-audit-logs.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { HttpClientModule } from '@angular/common/http';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { of } from 'rxjs';
import {
  DhAdminUserManagementAuditLogsDataAccessApiStore,
  DhUserAuditLogEntry,
} from '@energinet-datahub/dh/admin/data-access-api';

describe(DhUserAuditLogsComponent.name, () => {
  async function setup(
    store: Partial<DhAdminUserManagementAuditLogsDataAccessApiStore>
  ) {
    const { fixture } = await render(DhUserAuditLogsComponent, {
      componentProviders: [
        {
          provide: DhAdminUserManagementAuditLogsDataAccessApiStore,
          useValue: {
            isLoading$: of(false),
            hasGeneralError$: of(false),
            auditLogCount$: of(0),
            auditLogs$: of([]),
            ...store,
          },
        },
      ],
      imports: [getTranslocoTestingModule(), HttpClientModule],
    });

    fixture.componentInstance.user = {
      id: '4E19432C-1E46-43BE-9AB4-7A5984C66100',
      status: 'Active',
      email: 'fake@value',
      createdDate: '2023-01-10T10:12:06+00:00',
      name: 'fake value',
      assignedActors: [],
    };

    return { fixture };
  }

  test('should display valid count when no entries', async () => {
    // arrange
    await setup({});

    const noChangesMessage = screen.getByRole('heading', {
      name: enTranslations.admin.userManagement.tabs.history.changesPlural.replace(
        '{{ auditLogCount }}',
        '0'
      ),
    });

    // assert
    expect(noChangesMessage).toBeInTheDocument();
  });

  test('should display valid count when has entry', async () => {
    // arrange
    const entry: DhUserAuditLogEntry = {
      timestamp: '2023-01-10T10:12:00+00:00',
      entry: {
        timestamp: '2023-01-09T14:40:23+00:00',
        actorId: 'FBDEC5AC-F5A9-4783-9718-369582E0D437',
        assignmentType: 'Added',
        changedByUserId: '03DCF8A7-9BFD-4023-A206-8FFBC92A2D28',
        changedByUserName: 'fake_value',
        userRoleId: 'D4C3508E-B949-4849-B5E6-BD818724C727',
        userRoleName: 'fake_user_role',
      },
    };

    await setup({ auditLogs$: of([entry]), auditLogCount$: of(1) });

    const changesMessage = screen.getByRole('heading', {
      name: enTranslations.admin.userManagement.tabs.history.changesSingular.replace(
        '{{ auditLogCount }}',
        '1'
      ),
    });

    const rowTimestamp = screen.getByText('10-01-2023 11:12');

    // assert
    expect(changesMessage).toBeInTheDocument();
    expect(rowTimestamp).toBeInTheDocument();
  });
});
