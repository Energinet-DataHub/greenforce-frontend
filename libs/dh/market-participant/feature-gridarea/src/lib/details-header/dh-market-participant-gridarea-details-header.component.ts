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
import { Component, Input, NgModule, OnChanges } from '@angular/core';
import { LetModule } from '@rx-angular/template/let';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattBadgeModule,
  WattButtonModule,
  WattIconModule,
  WattEmptyStateModule,
  WattSpinnerModule,
  WattValidationMessageModule,
  WattDrawerModule,
} from '@energinet-datahub/watt';
import { MatMenuModule } from '@angular/material/menu';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { GridAreaOverviewRow } from '@energinet-datahub/dh/market-participant/data-access-api';

@Component({
  selector: 'dh-market-participant-gridarea-details-header',
  styleUrls: ['./dh-market-participant-gridarea-details-header.component.scss'],
  templateUrl: './dh-market-participant-gridarea-details-header.component.html',
})
export class DhMarketParticipantGridAreaDetailsHeaderComponent
  implements OnChanges
{
  @Input() gridArea?: GridAreaOverviewRow;

  ngOnChanges() {;}
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
  ],
  declarations: [DhMarketParticipantGridAreaDetailsHeaderComponent],
  exports: [DhMarketParticipantGridAreaDetailsHeaderComponent],
})
export class DhMarketParticipantGridAreaDetailsHeaderScam {}
