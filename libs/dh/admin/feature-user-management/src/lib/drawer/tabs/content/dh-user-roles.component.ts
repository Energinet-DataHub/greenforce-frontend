import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@rx-angular/template';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { DhAdminUserRolesStore } from '@energinet-datahub/dh/admin/data-access-api';
import {
  UserOverviewItemDto,
  UserRoleView,
} from '@energinet-datahub/dh/shared/domain';

@Component({
  providers: [DhAdminUserRolesStore],
  selector: 'dh-user-roles',
  standalone: true,
  templateUrl: './dh-user-roles.component.html',
  styles: [
    `
      .list {
        padding: 0;
        margin: 0;
        ul {
          list-style: none;
        }
        li {
          display: grid;
          margin-top: var(--watt-space-s);
          grid-template-columns: 20% 1fr;
        }
        li:not(:last-child) {
          border-bottom: 1px solid var(--watt-color-neutral-grey-300);
        }
      }
    `,
  ],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    WattSpinnerModule,
    WattCardModule,
    TranslocoModule,
  ],
})
export class DhUserRolesComponent implements OnInit {
  private readonly store = inject(DhAdminUserRolesStore);
  @Input() user: UserOverviewItemDto | null = null;

  userRoleView$ = this.store.userRoleView$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  getNumberOfRoles(userRoleView: UserRoleView | null): number {
    const test = userRoleView?.organizations?.map((org) =>
      org.actors?.map((actor) => actor.userRoles)
    ).length;
    console.log(test);
    return test ?? 0;
  }

  ngOnInit(): void {
    if (this.user?.id) {
      this.store.getUserRoleView(this.user.id);
    }
  }
}
