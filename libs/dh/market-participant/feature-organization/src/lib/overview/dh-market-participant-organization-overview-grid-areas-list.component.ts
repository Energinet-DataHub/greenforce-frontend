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
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-market-participant-organization-overview-grid-areas-list',
  styleUrls: [
    'dh-market-participant-organization-overview-grid-areas-list.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:
    './dh-market-participant-organization-overview-grid-areas-list.component.html',
})
export class DhMarketParticipantOrganizationOverviewGridAreasListComponent {
  @Input() gridAreas: GridAreaDto[] = [];
  @Input() marketRoleGridAreas: GridAreaDto[] = [];

  readonly getGridAreaInfo = (id: string) => {
    const grid = this.gridAreas.find((x) => x.id === id);
    return grid ? `${grid.code} - ${grid.name}` : '';
  };

  readonly getTooltip = () =>
    this.marketRoleGridAreas
      .map((gridArea) => this.getGridAreaInfo(gridArea.id))
      .join('\n');
}

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [DhMarketParticipantOrganizationOverviewGridAreasListComponent],
  exports: [DhMarketParticipantOrganizationOverviewGridAreasListComponent],
})
export class DhMarketParticipantOrganizationOverviewGridAreasScam {}
