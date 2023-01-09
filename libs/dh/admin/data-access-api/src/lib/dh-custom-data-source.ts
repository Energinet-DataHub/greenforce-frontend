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
import { DataSource } from '@angular/cdk/collections';
import { inject } from '@angular/core';

import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

import { DhAdminUserManagementDataAccessApiStore } from './dh-admin-user-management-data-access-api.store';

export class DhCustomDataSource implements DataSource<UserOverviewItemDto> {
  private readonly store = inject(DhAdminUserManagementDataAccessApiStore);

  connect() {
    return this.store.users$;
  }

  disconnect(): void {
    // Intentionally left empty.
  }
}
