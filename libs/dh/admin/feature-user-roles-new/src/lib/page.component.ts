import { Component } from '@angular/core';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import { DhUserRolesTableComponent } from './table.component';
import { DhUserRoleDetailsComponent } from './details/details.component';
import { DhCreateUserRoleModalComponent } from './create/dh-create-user-role-modal.component';

@Component({
  standalone: true,
  selector: 'dh-user-roles-page',
  template: `
    <dh-user-roles-table (open)="details.open($event)" (create)="create.open()" />
    <dh-create-user-role-modal #create />
    <dh-user-role-details #details />
  `,
  imports: [DhUserRolesTableComponent, DhCreateUserRoleModalComponent, DhUserRoleDetailsComponent],
  providers: [DhNavigationService],
})
export class DhUserRolesPageComponent {}
