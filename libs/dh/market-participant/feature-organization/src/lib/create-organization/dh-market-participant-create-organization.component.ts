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
import { Component, Input, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ContactChanges,
  DhMarketParticipantOverviewDataAccessApiStore,
  MasterData,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  ContactDto,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  WattButtonModule,
  WattFormFieldModule,
  WattInputModule,
  WattTabsModule,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { DhMarketParticipantOrganizationContactDataComponentScam } from './contact-data/dh-market-participant-organization-contact-data.component';
import { DhMarketParticipantOrganizationMasterDataComponentScam } from './master-data/dh-market-participant-organization-master-data.component';

@Component({
  selector: 'dh-market-participant-create-organization',
  styleUrls: ['./dh-market-participant-create-organization.component.scss'],
  templateUrl: './dh-market-participant-create-organization.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantCreateOrganizationComponent {
  @Input() organization: OrganizationDto | undefined;
  @Input() contacts: ContactDto[] = [];
  @Input() onMasterDataChanged!: (data: MasterData) => void;
  @Input() onContactsChanged!: (
    add: ContactChanges[],
    remove: ContactDto[]
  ) => void;
  @Input() onCancelCallback!: () => void;
  @Input() onSaveCallback!: () => void;
  organizationName = new FormControl('');
}

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonModule,
    WattFormFieldModule,
    WattInputModule,
    WattTabsModule,
    DhMarketParticipantOrganizationMasterDataComponentScam,
    DhMarketParticipantOrganizationContactDataComponentScam,
  ],
  exports: [DhMarketParticipantCreateOrganizationComponent],
  declarations: [DhMarketParticipantCreateOrganizationComponent],
})
export class DhMarketParticipantCreateOrganizationScam {}
