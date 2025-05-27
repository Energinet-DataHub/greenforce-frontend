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
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { BasePaths, ReportsSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-reports',
  imports: [TranslocoDirective, WATT_LINK_TABS, DhPermissionRequiredDirective],
  template: `
    <watt-link-tabs *transloco="let t; read: 'reports.tabs'">
      <watt-link-tab
        *dhPermissionRequired="['settlement-reports:manage']"
        [label]="t('settlementReports')"
        [link]="getLink('settlement-reports')"
      />
      <watt-link-tab
        *dhPermissionRequired="['measurements-reports:manage']"
        [label]="t('measurementsReports')"
        [link]="getLink('measurements-reports')"
      />
    </watt-link-tabs>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhReports {
  getLink = (path: ReportsSubPaths) =>
    `/${getPath<BasePaths>('reports')}/${getPath<ReportsSubPaths>('overview')}/${path}`;
}
