import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { TranslocoModule } from '@ngneat/transloco';
import { Permission, PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dh-admin-permission-roles',
  templateUrl: './dh-admin-permission-roles.component.html',
  styles: [``],
  standalone: true,
  imports: [
    CommonModule,
    WattCardModule,
    WattSpinnerModule,
    WATT_TABLE,
    WattEmptyStateModule,
    TranslocoModule,
  ],
})
export class DhAdminPermissionRolesComponent {
  @Input() selectedPermission: PermissionDto | null = null;

  dataSource = new WattTableDataSource<Permission>();

  subscription!: Subscription;
  private apollo = inject(Apollo);
}
