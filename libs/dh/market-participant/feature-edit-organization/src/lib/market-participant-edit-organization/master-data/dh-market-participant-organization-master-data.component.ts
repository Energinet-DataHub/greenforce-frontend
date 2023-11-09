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
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrganizationChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattTextFieldTDComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';
import { MarketParticipantOrganizationStatus } from '@energinet-datahub/dh/shared/domain';
import { getValidOrganizationStatusTransitionOptions } from './get-valid-organization-status-transition-options';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dh-market-participant-organization-master-data',
  styleUrls: ['./dh-market-participant-organization-master-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-organization-master-data.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RxLet,
    FormsModule,
    TranslocoModule,
    WattDropdownComponent,
    WattTextFieldTDComponent,
    WattFieldErrorComponent,
  ],
})
export class DhMarketParticipantOrganizationMasterDataComponent implements OnChanges {
  @Input() changes!: OrganizationChanges;

  countries: WattDropdownOption[] = [];

  initialOrganizationStatus?: MarketParticipantOrganizationStatus;
  allStatuses: WattDropdownOption[] = [];
  statuses: WattDropdownOption[] = [];

  constructor(private translocoService: TranslocoService) {
    this.translocoService
      .selectTranslateObject('marketParticipant.organization.create.masterData.countries')
      .pipe(takeUntilDestroyed())
      .subscribe((countryTranslations) => {
        this.countries = Object.keys(countryTranslations)
          .map((key) => ({
            value: key.toUpperCase(),
            displayValue: countryTranslations[key],
          }))
          .sort((a, b) => a.displayValue.localeCompare(b.displayValue));
      });

    this.translocoService
      .selectTranslateObject('marketParticipant.organization.create.masterData.statuses')
      .pipe(takeUntilDestroyed())
      .subscribe((statusKeys) => {
        this.allStatuses = Object.keys(MarketParticipantOrganizationStatus).map((key) => ({
          value: key,
          displayValue: statusKeys[key] ?? key,
        }));
        this.statuses = getValidOrganizationStatusTransitionOptions(
          this.initialOrganizationStatus ?? MarketParticipantOrganizationStatus.New,
          this.allStatuses
        );
      });
  }

  ngOnChanges(): void {
    this.initialOrganizationStatus = this.changes?.status;
    this.statuses = getValidOrganizationStatusTransitionOptions(
      this.initialOrganizationStatus ?? MarketParticipantOrganizationStatus.New,
      this.allStatuses
    );
  }
}
