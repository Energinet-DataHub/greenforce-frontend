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
import { PageEvent } from '@angular/material/paginator';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';

import { DhUsersTabTableComponent } from './dh-users-tab-table.component';

@Component({
  selector: 'dh-users-tab',
  templateUrl: './dh-users-tab.component.html',
  styleUrls: ['./dh-users-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslocoModule,
    WattCardModule,
    DhUsersTabTableComponent,
    DhSharedUiPaginatorComponent,
  ],
})
export class DhUsersTabComponent {
  @Input() users: UserOverviewItemDto[] = [];
  @Input() totalUserCount!: number;

  @Input() pageSize!: number;
  @Input() pageIndex!: number;

  @Output() pageChange = new EventEmitter<PageEvent>();
}
