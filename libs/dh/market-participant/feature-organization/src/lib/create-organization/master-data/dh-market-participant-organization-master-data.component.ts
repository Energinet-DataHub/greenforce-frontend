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
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MasterDataChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { OrganizationDto } from '@energinet-datahub/dh/shared/domain';
import {
  WattDropdownModule,
  WattDropdownOption,
  WattFormFieldModule,
  WattInputModule,
} from '@energinet-datahub/watt';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'dh-market-participant-organization-master-data',
  styleUrls: [
    './dh-market-participant-organization-master-data.component.scss',
  ],
  templateUrl:
    './dh-market-participant-organization-master-data.component.html',
  providers: [],
})
export class DhMarketParticipantOrganizationMasterDataComponent
  implements OnInit, OnChanges
{
  @Input() organization: OrganizationDto | undefined;
  @Output() hasChanges = new EventEmitter<MasterDataChanges>();

  constructor(private translocoService: TranslocoService) {}

  changes: MasterDataChanges = { isValid: false, address: { country: 'DK' } };
  countries: WattDropdownOption[] = [];

  ngOnInit(): void {
    const countryTranslations = this.translocoService.translateObject(
      'marketParticipant.organization.create.masterData.countries'
    );

    this.countries = Object.keys(countryTranslations)
      .map((key) => ({
        value: key.toUpperCase(),
        displayValue: countryTranslations[key],
      }))
      .sort((a, b) => {
        if (a.displayValue < b.displayValue) {
          return -1;
        }
        if (a.displayValue > b.displayValue) {
          return 1;
        }
        return 0;
      });
  }

  ngOnChanges(): void {
    if (this.organization !== undefined) {
      this.changes = { ...this.organization, isValid: true };
    }
  }

  readonly onModelChanged = () => {
    this.hasChanges.emit(this.changes);
  };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    WattDropdownModule,
    WattFormFieldModule,
    WattInputModule,
  ],
  exports: [DhMarketParticipantOrganizationMasterDataComponent],
  declarations: [DhMarketParticipantOrganizationMasterDataComponent],
})
export class DhMarketParticipantOrganizationMasterDataComponentScam {}
