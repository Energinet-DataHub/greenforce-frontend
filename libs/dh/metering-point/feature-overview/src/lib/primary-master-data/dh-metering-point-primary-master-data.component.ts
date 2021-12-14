/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/data-access-api';
import { WattIconModule, WattIconSize } from '@energinet-datahub/watt';

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
  iconSizes = WattIconSize;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.primaryMasterData && changes.primaryMasterData.currentValue) {
      this.address = this.formatAddress(changes.primaryMasterData.currentValue);
    }
  }

  private formatAddress(data: PrimaryMasterData): string {
    if (
      !data.streetName &&
      !data.buildingNumber &&
      !data.citySubDivisionName &&
      !data.cityName &&
      !data.postalCode
    ) {
      return '—';
    }

    let address = `${data.streetName} ${data.buildingNumber}`;
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
    return address;
  }
}

@NgModule({
  declarations: [DhMeteringPointPrimaryMasterDataComponent],
  imports: [CommonModule, WattIconModule, TranslocoModule],
  exports: [DhMeteringPointPrimaryMasterDataComponent],
})
export class DhMeteringPointPrimaryMasterDataScam {}
