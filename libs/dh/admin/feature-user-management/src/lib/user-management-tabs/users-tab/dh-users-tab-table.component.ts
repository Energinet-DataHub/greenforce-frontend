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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTableModule } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhCustomDataSource } from '@energinet-datahub/dh/admin/data-access-api';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';

@Component({
  selector: 'dh-users-tab-table',
  standalone: true,
  templateUrl: './dh-users-tab-table.component.html',
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
  ],
})
export class DhUsersTabTableComponent {
  dataSource = new DhCustomDataSource();
  displayedColumns = ['name', 'email', 'phone', 'status'];

  pageSizeOptions = [2, 4, 5];

  @Input() totalUsersCount!: number;

  @Input() pageSize!: number;
  @Input() pageIndex!: number;

  @Output() pageChange = new EventEmitter<PageEvent>();
}
