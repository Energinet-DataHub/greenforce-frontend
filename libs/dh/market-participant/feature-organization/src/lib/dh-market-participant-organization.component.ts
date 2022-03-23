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
import { Component, NgModule } from '@angular/core';
import { DhMarketParticipantOverviewDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import { MatTableModule } from '@angular/material/table';
import { ActorDto, OrganizationDto } from '@energinet-datahub/dh/shared/domain';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattBadgeModule,
  WattButtonModule,
  WattIconModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';
import { MatMenuModule } from '@angular/material/menu';

interface OrganizationWithActor {
  organization: Partial<OrganizationDto>;
  actor: Partial<ActorDto>;
}

@Component({
  selector: 'dh-market-participant-organization',
  styleUrls: ['./dh-market-participant-organization.component.scss'],
  templateUrl: './dh-market-participant-organization.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantOrganizationComponent {
  constructor(public store: DhMarketParticipantOverviewDataAccessApiStore) {}

  columnIds = [
    'OrgName',
    'ActorGln',
    'ActorStatus',
    'ActorRoles',
    'ActorGridAreas',
    'RowEdit',
  ];

  items = this.store.organizations.reduce(
    (runningItems, organizationDto) =>
      runningItems.concat(
        organizationDto.actors.map((actor) => ({
          organization: organizationDto,
          actor: actor,
        }))
      ),
    [] as OrganizationWithActor[]
  );

  onEditClicked = (value: OrganizationWithActor) => {
    console.log('Edit', value);
  };
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    MatTableModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattIconModule,
    WattEmptyStateModule,
    MatMenuModule,
  ],
  declarations: [DhMarketParticipantOrganizationComponent],
})
export class DhMarketParticipantOrganizationScam {}
