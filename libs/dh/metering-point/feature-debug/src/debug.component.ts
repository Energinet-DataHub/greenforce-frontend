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
import { getPath, MeteringPointDebugSubPaths } from '@energinet-datahub/dh/core/routing';
import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'dh-metering-point-debug',
  imports: [TranslocoDirective, WATT_LINK_TABS, VaterUtilityDirective],
  template: `
    <watt-link-tabs vater inset="0" *transloco="let t; read: 'meteringPointDebug'">
      <watt-link-tab [label]="t('meteringPoint.tabLabel')" [link]="getLink('metering-point')" />
      <watt-link-tab [label]="t('meteringPoints.tabLabel')" [link]="getLink('metering-points')" />
    </watt-link-tabs>
  `,
})
export class DhMeteringPointDebugComponent {
  getLink = (path: MeteringPointDebugSubPaths) => getPath(path);
}
