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
import { Component, inject, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { DhAdminUserRolesStore } from '@energinet-datahub/dh/admin/data-access-api';
import { MatDividerModule } from '@angular/material/divider';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { UserRoleCountPipe } from '../../../shared/dh-user-role-count.pipe';
import { JoinUserRoles } from '../../../shared/dh-join-user-roles.pipe';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  providers: [DhAdminUserRolesStore],
  selector: 'dh-user-roles',
  standalone: true,
  templateUrl: './dh-user-roles.component.html',
  styleUrls: ['./dh-user-roles.component.scss'],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    WattSpinnerModule,
    WattCardModule,
    TranslocoModule,
    UserRoleCountPipe,
    JoinUserRoles,
    MatDividerModule,
    WattEmptyStateModule,
  ],
})
export class DhUserRolesComponent implements OnChanges {
  private readonly store = inject(DhAdminUserRolesStore);
  @Input() user: UserOverviewItemDto | null = null;

  userRoleView$ = this.store.userRoleView$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  ngOnChanges(): void {
    if (this.user?.id) {
      this.store.getUserRoleView(this.user.id);
    }
  }
}
