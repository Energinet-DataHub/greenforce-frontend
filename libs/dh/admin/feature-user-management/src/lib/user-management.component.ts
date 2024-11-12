import { Component } from '@angular/core';
import { DhInviteUserModalComponent } from './invite/invite.component';

@Component({
  standalone: true,
  selector: 'dh-user-management',
  template: ` <dh-invite-user-modal /> `,
  imports: [DhInviteUserModalComponent],
})
export class DhUserManagementComponent {}
