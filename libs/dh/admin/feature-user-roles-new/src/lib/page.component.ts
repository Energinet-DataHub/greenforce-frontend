import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import { DhUserRolesTableComponent } from './table.component';

@Component({
  standalone: true,
  selector: 'dh-user-roles-page',
  template: `
    <dh-user-roles-table (open)="navigate($event.id)" />
    <router-outlet />
  `,
  imports: [DhUserRolesTableComponent, RouterOutlet],
  providers: [DhNavigationService],
})
export class DhUserRolesPageComponent {
  private navigationService = inject(DhNavigationService);

  navigate(id: string) {
    this.navigationService.navigate('details', id);
  }
}
