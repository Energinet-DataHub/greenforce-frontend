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
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template/let';

import { DhMeteringPointIdentityComponent } from './identity/dh-metering-point-identity.component';
import { DhMeteringPointPrimaryMasterDataComponent } from './primary-master-data/dh-metering-point-primary-master-data.component';
import { DhSecondaryMasterDataComponent } from './secondary-master-data/dh-secondary-master-data.component';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

@Component({
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
    DhMeteringPointIdentityComponent,
    DhMeteringPointPrimaryMasterDataComponent,
    DhSecondaryMasterDataComponent,
  ],
})
export class DhMeteringPointIdentityAndMasterDataScam {}
