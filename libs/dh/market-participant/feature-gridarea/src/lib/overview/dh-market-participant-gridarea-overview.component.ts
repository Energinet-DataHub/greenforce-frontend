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
  Component,
  Input,
  NgModule,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { LetModule } from '@rx-angular/template/let';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattBadgeModule,
  WattButtonModule,
  WattIconModule,
  WattEmptyStateModule,
  WattSpinnerModule,
  WattValidationMessageModule,
  WattDrawerModule,
  WattDrawerComponent,
} from '@energinet-datahub/watt';
import { MatMenuModule } from '@angular/material/menu';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import {
  GridAreaChanges,
  GridAreaOverviewRow,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhMarketParticipantGridAreaDetailsHeaderScam } from '../details-header/dh-market-participant-gridarea-details-header.component';
import { DhMarketParticipantGridAreaEditScam } from '../details-edit/dh-market-participant-gridarea-edit.component';

@Component({
  selector: 'dh-market-participant-gridarea-overview',
  styleUrls: ['./dh-market-participant-gridarea-overview.component.scss'],
  templateUrl: './dh-market-participant-gridarea-overview.component.html',
})
export class DhMarketParticipantGridAreaOverviewComponent implements OnChanges {
  @ViewChild('drawer') drawer!: WattDrawerComponent;

  columnIds = [
    'code',
    'name',
    'actorName',
    'actorNumber',
    'priceAreaCode',
    'validFrom',
    'validTo',
  ];

  @Input() gridAreas: GridAreaOverviewRow[] = [];
  @Input() gridChanges!: (changes: {
    gridAreaChanges: GridAreaChanges;
    onCompleted: () => void;
  }) => void;

  readonly dataSource: MatTableDataSource<GridAreaOverviewRow> =
    new MatTableDataSource<GridAreaOverviewRow>();

  activeRow?: GridAreaOverviewRow;

  ngOnChanges() {
    this.dataSource.data = this.gridAreas;
  }

  readonly drawerClosed = () => console.log('drawer closed');

  readonly open = (row: GridAreaOverviewRow) => {
    this.activeRow = row;
    this.drawer.open();
  };
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    MatTableModule,
    MatMenuModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattIconModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattValidationMessageModule,
    DhEmDashFallbackPipeScam,
    DhSharedUiDateTimeModule,
    WattDrawerModule,
    DhMarketParticipantGridAreaDetailsHeaderScam,
    DhMarketParticipantGridAreaEditScam,
  ],
  declarations: [DhMarketParticipantGridAreaOverviewComponent],
  exports: [DhMarketParticipantGridAreaOverviewComponent],
})
export class DhMarketParticipantGridAreaOverviewScam {}
