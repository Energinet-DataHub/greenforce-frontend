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
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LetModule } from '@rx-angular/template';

import { DhMeteringPointIdentityScam } from './identity/dh-metering-point-identity.component';
import { DhMeteringPointPrimaryMasterDataScam } from './primary-master-data/dh-metering-point-primary-master-data.component';
import { DhSecondaryMasterDataComponentScam } from './secondary-master-data/dh-secondary-master-data.component';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-identity-and-master-data',
  templateUrl: './dh-metering-point-identity-and-master-data.template.html',
})
export class DhMeteringPointIdentityAndMasterDataComponent {
  meteringPoint$ = this.store.meteringPoint$;

  constructor(private store: DhMeteringPointDataAccessApiStore) {}
}

@NgModule({
  declarations: [DhMeteringPointIdentityAndMasterDataComponent],
  exports: [DhMeteringPointIdentityAndMasterDataComponent],
  imports: [
    CommonModule,
    LetModule,
    DhMeteringPointIdentityScam,
    DhMeteringPointPrimaryMasterDataScam,
    DhSecondaryMasterDataComponentScam,
  ],
})
export class DhMeteringPointIdentityAndMasterDataScam {}
