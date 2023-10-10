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
import { Component, Input, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhOrganization } from '../dh-organization';
import { DhOrganizationDrawerComponent } from '../drawer/dh-organization-drawer.component';

@Component({
  selector: 'dh-organizations-table',
  standalone: true,
  templateUrl: './dh-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    NgIf,
    TranslocoDirective,

    WATT_TABLE,
    WattEmptyStateComponent,
    VaterFlexComponent,
    VaterStackComponent,

    DhEmDashFallbackPipe,
    DhOrganizationDrawerComponent,
  ],
})
export class DhOrganizationsTableComponent {
  activeRow: DhOrganization | undefined = undefined;

  columns: WattTableColumnDef<DhOrganization> = {
    cvrOrBusinessRegisterId: { accessor: 'businessRegisterIdentifier' },
    name: { accessor: 'name' },
    status: { accessor: 'status' },
  };

  @Input() isLoading!: boolean;
  @Input() hasError!: boolean;

  @Input() tableDataSource!: WattTableDataSource<DhOrganization>;

  @ViewChild(DhOrganizationDrawerComponent)
  drawer: DhOrganizationDrawerComponent | undefined;

  onRowClick(organization: DhOrganization): void {
    this.activeRow = organization;

    // todo fix nullable organizationId
    this.drawer?.open(organization.organizationId ?? '');
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
