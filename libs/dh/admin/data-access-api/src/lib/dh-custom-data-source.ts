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
