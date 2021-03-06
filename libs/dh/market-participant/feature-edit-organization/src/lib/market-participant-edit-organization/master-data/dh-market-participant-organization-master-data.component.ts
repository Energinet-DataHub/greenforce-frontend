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
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrganizationChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  WattDropdownModule,
  WattDropdownOption,
  WattFormFieldModule,
  WattInputModule,
} from '@energinet-datahub/watt';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { LetModule } from '@rx-angular/template/let';

@Component({
  selector: 'dh-market-participant-organization-master-data',
  styleUrls: [
    './dh-market-participant-organization-master-data.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:
    './dh-market-participant-organization-master-data.component.html',
})
export class DhMarketParticipantOrganizationMasterDataComponent
  implements OnDestroy
{
  @Input() changes!: OrganizationChanges;

  private destroy$ = new Subject<void>();

  constructor(private translocoService: TranslocoService) {
    this.translocoService
      .selectTranslateObject(
        'marketParticipant.organization.create.masterData.countries'
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((countryTranslations) => {
        this.countries = Object.keys(countryTranslations)
          .map((key) => ({
            value: key.toUpperCase(),
            displayValue: countryTranslations[key],
          }))
          .sort((a, b) => a.displayValue.localeCompare(b.displayValue));
      });
  }

  countries: WattDropdownOption[] = [];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
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
