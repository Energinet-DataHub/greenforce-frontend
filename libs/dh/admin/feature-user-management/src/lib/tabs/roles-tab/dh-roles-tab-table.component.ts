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
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { UserRoleInfoDto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { DhRoleStatusComponent } from '../../shared/dh-role-status.component';

@Component({
  selector: 'dh-roles-tab-table',
  standalone: true,
  templateUrl: './dh-roles-tab-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    TranslocoModule,
    DhEmDashFallbackPipeScam,
    MatTableModule,
    DhSharedUiPaginatorComponent,
    DhRoleStatusComponent
  ],
})
export class DhRolesTabTableComponent implements OnChanges, AfterViewInit {
  @Input() roles: UserRoleInfoDto[] = [];
  displayedColumns = ['name', 'description', 'marketrole', 'status'];

  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

  readonly dataSource: MatTableDataSource<UserRoleInfoDto> =
  new MatTableDataSource<UserRoleInfoDto>();

  ngOnChanges() {
    this.dataSource.data = this.roles;
    this.dataSource.paginator = this.paginator?.instance;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator.instance;
  }

}
