import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { TranslocoModule } from '@ngneat/transloco';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ApolloError } from '@apollo/client';
import { graphql } from '@energinet-datahub/dh/shared/domain';

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
export class DhAdminPermissionRolesComponent implements OnInit {
  @Input() selectedPermission: PermissionDto | null = null;
  private apollo = inject(Apollo);

  dataSource = new WattTableDataSource<graphql.UserRole>();

  columns: WattTableColumnDef<graphql.UserRole> = {
    name: { accessor: 'name' },
  };

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
