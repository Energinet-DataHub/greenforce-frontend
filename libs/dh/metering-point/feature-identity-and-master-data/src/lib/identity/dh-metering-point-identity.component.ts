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
import { TranslocoModule } from '@ngneat/transloco';

import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/domain';
import { DhMeteringPointIdentityTextFieldWithIconComponent } from './identity-text-field/dh-metering-point-identity-text-field-with-icon.component';
import { DhMeteringPointStatusBadgeScam } from '@energinet-datahub/dh/metering-point/ui-status-badge';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

export interface MeteringPointIdentityTranslationKeys {
  meteringMethod: string;
  meteringPointType: string;
  readingOccurrence: string;
  settlementMethod?: string;
  meteringPointId: string;
  electricitySupplierSince?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-identity',
  styleUrls: ['./dh-metering-point-identity.component.scss'],
  templateUrl: './dh-metering-point-identity.component.html',
})
export class DhMeteringPointIdentityComponent {
  identityDetails!: MeteringPointCimDto;
  translationKeys?: MeteringPointIdentityTranslationKeys;
  address?: string;

  @Input()
  set identityData(data: MeteringPointCimDto | undefined) {
    if (data == undefined) {
      return;
    }

    this.identityDetails = data;
    this.translationKeys = this.buildTranslations(data);
    this.address = this.formatAddress(data);
  }

  private formatAddress = (data: MeteringPointCimDto): string => {
    let address = `${data.streetName}`;
    if (data.buildingNumber) {
      address += ` ${data.buildingNumber}`;
    }

    if (data.floorIdentification || data.suiteNumber) {
      address += `,`;
      if (data.floorIdentification) {
        address += ` ${data.floorIdentification}.`;
      }
      if (data.suiteNumber) {
        address += ` ${data.suiteNumber}`;
      }
    }

    if (data.citySubDivisionName) {
      address += ` ${data.citySubDivisionName}`;
    }

    return `${address} ${data.postalCode} ${data.cityName}`;
  };

  private buildTranslations = (
    data: MeteringPointCimDto,
    nestedKey = 'meteringPoint.overview'
  ): MeteringPointIdentityTranslationKeys => ({
    electricitySupplierSince: `${nestedKey}.primaryMasterData.since`,
    meteringPointId: `${nestedKey}.primaryMasterData.meterNumber`,
    meteringMethod: `meteringPoint.meteringPointSubTypeCode.${data.meteringMethod}`,
    meteringPointType: `meteringPoint.meteringPointTypeCode.${data.meteringPointType}`,
    readingOccurrence: `meteringPoint.readingOccurrenceCode.${data.readingOccurrence}`,
    ...(data?.settlementMethod && {
      settlementMethod: `meteringPoint.settlementMethodCode.${data.settlementMethod}`,
    }),
  });
}

@NgModule({
  declarations: [DhMeteringPointIdentityComponent],
  exports: [DhMeteringPointIdentityComponent],
  imports: [
    DhMeteringPointIdentityTextFieldWithIconComponent,
    DhMeteringPointStatusBadgeScam,
    DhEmDashFallbackPipeScam,
    DhSharedUiDateTimeModule,
    CommonModule,
    TranslocoModule,
  ],
})
export class DhMeteringPointIdentityScam {}
