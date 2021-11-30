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
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattIconModule, WattIconSize } from '@energinet-datahub/watt';
import { CommonModule } from '@angular/common';

interface PrimaryMasterData {
  streetName?: string;
  buildingNumber?: string;
  floor?: string;
  suite?: string;
  citySubDivisionName?: string;
  postCode?: string;
  isActualAddress?: boolean | null;
  locationDescription?: string;
  geoInfoReference?: string | null;
  supplyStart?: string | null;
  meterNumber?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-primary-master-data',
  styleUrls: ['./dh-metering-point-primary-master-data.component.scss'],
  templateUrl: './dh-metering-point-primary-master-data.component.html',
  providers: [],
})
export class DhMeteringPointPrimaryMasterDataComponent {
  @Input() primaryMasterData?: PrimaryMasterData = {
    streetName: undefined,
    buildingNumber: undefined,
    floor: undefined,
    suite: undefined,
    citySubDivisionName: undefined,
    postCode: undefined,
    isActualAddress: undefined,
    locationDescription: undefined,
    geoInfoReference: undefined,
    supplyStart: undefined,
    meterNumber: undefined
  };
  iconSizes = WattIconSize;
}

@NgModule({
  declarations: [DhMeteringPointPrimaryMasterDataComponent],
  imports: [CommonModule, WattIconModule, TranslocoModule],
  exports: [DhMeteringPointPrimaryMasterDataComponent],
})
export class DhMeteringPointPrimaryMasterDataScam {}
