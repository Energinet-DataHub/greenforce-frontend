import { Component, inject } from '@angular/core';
import { DhPermissionsTableComponent } from './table.component';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'dh-permissions-page',
  imports: [RouterOutlet, DhPermissionsTableComponent],
  template: `
    <dh-permissions-table (open)="navigate($event.id)" />
    <router-outlet />
  `,
  providers: [DhNavigationService],
})
export class DhPermissionsPageComponent {
  private nagationService = inject(DhNavigationService);

  navigate(id: string | number) {
    this.nagationService.navigate('details', id);
  }
}
