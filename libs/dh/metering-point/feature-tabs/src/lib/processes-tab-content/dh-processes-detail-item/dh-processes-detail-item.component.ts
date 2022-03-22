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
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewChild,
} from '@angular/core';
import {
  MatSort,
  MatSortable,
  MatSortModule,
  Sort,
} from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DhProcess } from '@energinet-datahub/dh/metering-point/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

import {
  WattEmptyStateModule,
  WattIconModule,
  WattIconSize,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ProcessDetail } from '@energinet-datahub/dh/shared/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-processes-detail-item[detail]',
  templateUrl: './dh-processes-detail-item.component.html',
  styleUrls: ['./dh-processes-detail-item.component.scss'],
})
export class DhProcessesDetailItemComponent {
  iconSize = WattIconSize;
  @Input()
  detail!: ProcessDetail;
}

@NgModule({
  declarations: [DhProcessesDetailItemComponent],
  imports: [WattIconModule, CommonModule, DhSharedUiDateTimeModule],
  exports: [DhProcessesDetailItemComponent],
})
export class DhProcessesDetailItemScam {}
