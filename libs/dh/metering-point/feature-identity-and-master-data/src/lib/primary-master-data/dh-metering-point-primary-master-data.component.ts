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
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoModule } from '@ngneat/transloco';

import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WattIcon, WattIconModule } from '@energinet-datahub/watt/icon';
import {
  DhEmDashFallbackPipeScam,
  DhIsParentPipeScam,
  DhShowForMeteringPointTypeDirectiveScam,
  DhYesNoPipeScam,
} from '@energinet-datahub/dh/metering-point/shared/ui-util';

export type PrimaryMasterData = Pick<
  MeteringPointCimDto,
  | 'streetName'
  | 'buildingNumber'
  | 'floorIdentification'
  | 'suiteNumber'
  | 'cityName'
  | 'citySubDivisionName'
  | 'postalCode'
  | 'isActualAddress'
  | 'locationDescription'
  | 'darReference'
  | 'supplyStart'
  | 'meterId'
  | 'meteringPointType'
>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-primary-master-data',
  styleUrls: ['./dh-metering-point-primary-master-data.component.scss'],
  templateUrl: './dh-metering-point-primary-master-data.component.html',
})
export class DhMeteringPointPrimaryMasterDataComponent implements OnChanges {
  @Input() primaryMasterData?: PrimaryMasterData;
  address?: string;
  isActualAddressIcon: WattIcon = 'success';
  actualAddressTranslationKey = 'actualAddress';

  get electricitySupplierSinceTranslationKey(): string | undefined {
    if (this.primaryMasterData?.supplyStart == null) {
      return;
    }

    return 'meteringPoint.overview.primaryMasterData.since';
  }

  get isSupplyStartSet(): boolean {
    return this.primaryMasterData?.supplyStart != null;
  }

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.primaryMasterData && changes.primaryMasterData.currentValue) {
      const currentValue = changes.primaryMasterData.currentValue;

      this.address = this.formatAddress(currentValue);
      if (currentValue.isActualAddress) {
        this.isActualAddressIcon = 'success';
        this.actualAddressTranslationKey = 'actualAddress';
      } else {
        this.isActualAddressIcon = 'warning';
        this.actualAddressTranslationKey = 'notActualAddress';
      }
    }
  }

  private formatAddress(data: PrimaryMasterData): string {
    let address = `${data.streetName}`;
    if (data.buildingNumber) {
      address += ` ${data.buildingNumber}`;
    }
    if (data.floorIdentification || data.suiteNumber) {
      address += ',';
    }
    if (data.floorIdentification) {
      address += ` ${data.floorIdentification}.`;
    }
    if (data.suiteNumber) {
      address += ` ${data.suiteNumber}`;
    }
    if (data.citySubDivisionName) {
      address += `<br />${data.citySubDivisionName}`;
    }
    address += `<br />${data.postalCode} ${data.cityName}`;
    return this.domSanitizer.sanitize(SecurityContext.HTML, address) as string;
  }
}

@NgModule({
  declarations: [DhMeteringPointPrimaryMasterDataComponent],
  imports: [
    CommonModule,
    WattIconModule,
    TranslocoModule,
    DhEmDashFallbackPipeScam,
    DhSharedUiDateTimeModule,
    DhYesNoPipeScam,
    DhIsParentPipeScam,
    DhShowForMeteringPointTypeDirectiveScam,
  ],
  exports: [DhMeteringPointPrimaryMasterDataComponent],
})
export class DhMeteringPointPrimaryMasterDataScam {}
