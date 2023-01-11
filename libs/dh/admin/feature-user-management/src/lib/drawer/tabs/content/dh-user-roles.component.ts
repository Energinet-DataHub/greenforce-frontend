import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@rx-angular/template';
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
