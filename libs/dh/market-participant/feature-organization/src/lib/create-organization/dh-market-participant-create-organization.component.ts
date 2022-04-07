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
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import {
  ContactChanges,
  DhMarketParticipantOverviewDataAccessApiStore,
  MasterDataChanges,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  ChangeOrganizationDto,
  ContactDto,
  OrganizationDto,
} from '@energinet-datahub/dh/shared/domain';
import { WattButtonModule, WattTabsModule } from '@energinet-datahub/watt';
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
  @Input() contacts: ContactDto[] | undefined;
  @Input() isBusy = false;

  @Output() save = new EventEmitter<{
    organization: OrganizationDto | undefined;
    changedOrganization: ChangeOrganizationDto;
    addedContacts: ContactDto[];
    removedContacts: ContactDto[];
  }>();
  @Output() cancel = new EventEmitter();

  masterDataChanges: MasterDataChanges | undefined;
  addedContacts: ContactChanges[] = [];
  removedContacts: ContactDto[] = [];
  allowSaveChanges = false;

  readonly hasMasterDataChanges = (changes: MasterDataChanges) => {
    this.masterDataChanges = changes;
    this.allowSaveChanges = this.validateChanges();
  };

  readonly hasContactChanges = (
    add: ContactChanges[],
    remove: ContactDto[]
  ) => {
    this.addedContacts = add;
    this.removedContacts = remove;
    this.allowSaveChanges = this.validateChanges();
  };

  readonly onSaveClicked = () => {
    if (this.masterDataChanges !== undefined) {
      const changedOrganization: ChangeOrganizationDto = {
        ...this.masterDataChanges,
      } as ChangeOrganizationDto;

      this.save.emit({
        organization: this.organization,
        changedOrganization,
        addedContacts: this.addedContacts.map(
          (contactChanges) => ({ ...contactChanges } as ContactDto)
        ),
        removedContacts: this.removedContacts,
      });
    }
  };

  readonly onCancelClicked = () => {
    this.cancel.emit();
  };

  readonly validateChanges = () => {
    return (
      (this.masterDataChanges?.isValid ?? false) &&
      (this.masterDataChanges?.name?.length ?? 0) > 0
    );
  };
}

@NgModule({
  imports: [
    TranslocoModule,
    CommonModule,
    WattButtonModule,
    WattTabsModule,
    DhMarketParticipantOrganizationMasterDataComponentScam,
    DhMarketParticipantOrganizationContactDataComponentScam,
  ],
  exports: [DhMarketParticipantCreateOrganizationComponent],
  declarations: [DhMarketParticipantCreateOrganizationComponent],
})
export class DhMarketParticipantCreateOrganizationScam {}
