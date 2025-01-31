//#region License
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
//#endregion
import { Component } from '@angular/core';
import { DhCommercialRelationsComponent } from './commercial-relations.component';
import { DhMeteringPointsComponent } from './metering-points.component';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';

@Component({
  selector: 'dh-metering-point',
  imports: [DhCommercialRelationsComponent, DhMeteringPointsComponent, WATT_TABS],
  template: `
    <watt-tabs>
      <watt-tab label="Metering points">
        <dh-metering-points />
      </watt-tab>
      <watt-tab label="Commercial relations">
        <dh-commercial-relations />
      </watt-tab>
    </watt-tabs>
  `,
})
export class DhMeteringPointComponent {}
