import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

interface DhUserManagementState {
  users: UserOverviewItemDto[];
}

const initialState: DhUserManagementState = {
  users: [],
};

@Injectable()
export class DhAdminUserManagementDataAccessApiStore extends ComponentStore<DhUserManagementState> {
  numberOfUsers$ = this.select((store) => store.users.length);

  constructor() {
    super(initialState);
  }
}
