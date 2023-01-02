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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/domain';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';

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
export class DhMeteringPointPrimaryMasterDataComponent {
  @Input() primaryMasterData?: PrimaryMasterData;
}

@NgModule({
  declarations: [DhMeteringPointPrimaryMasterDataComponent],
  imports: [CommonModule, TranslocoModule, DhEmDashFallbackPipeScam],
  exports: [DhMeteringPointPrimaryMasterDataComponent],
})
export class DhMeteringPointPrimaryMasterDataScam {}
