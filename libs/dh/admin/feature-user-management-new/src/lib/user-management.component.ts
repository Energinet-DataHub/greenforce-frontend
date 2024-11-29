import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import { DhUsersComponent } from './table/table.component';
import { DhInviteUserComponent } from './invite/invite.component';

@Component({
  standalone: true,
  selector: 'dh-user-management',
  providers: [DhNavigationService],
  template: `
    <dh-invite-user #invite />
    <dh-users (open)="navigate($event.id)" (invite)="invite.open()" />
    <router-outlet />
  `,
  imports: [DhUsersComponent, DhInviteUserComponent, RouterOutlet],
})
export class DhUserManagementComponent {
  private navigationService = inject(DhNavigationService);

  navigate(id: string) {
    this.navigationService.navigate('details', id);
  }
}
