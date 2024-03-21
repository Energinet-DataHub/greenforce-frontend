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
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
  WattTableComponent,
} from '@energinet-datahub/watt/table';
import { MarketParticipantPermissionDetailsDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-permissions-table',
  standalone: true,
  templateUrl: './dh-permissions-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [TranslocoDirective, WATT_TABLE],
})
export class DhPermissionsTableComponent implements OnChanges {
  @Input() permissions: MarketParticipantPermissionDetailsDto[] = [];
  @Input() initialSelection: MarketParticipantPermissionDetailsDto[] = [];

  @Output() selectionChanged = new EventEmitter<MarketParticipantPermissionDetailsDto[]>();

  @ViewChild(WattTableComponent<MarketParticipantPermissionDetailsDto>)
  permissionsTable!: WattTableComponent<MarketParticipantPermissionDetailsDto>;

  readonly dataSource: WattTableDataSource<MarketParticipantPermissionDetailsDto> =
    new WattTableDataSource<MarketParticipantPermissionDetailsDto>();

  columns: WattTableColumnDef<MarketParticipantPermissionDetailsDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  ngOnChanges() {
    this.dataSource.data = this.permissions;
    if (this.permissionsTable) this.permissionsTable.clearSelection();
  }

  onSelectionChange(selections: MarketParticipantPermissionDetailsDto[]): void {
    this.selectionChanged.emit(selections);
  }
}
