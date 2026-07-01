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

import { WATT_LINK_TABS } from '@energinet/watt/tabs';
import { VATER } from '@energinet/watt/vater';
import {
  MissingMeasurementsLogSubPaths,
  ReportsSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhReleaseToggleDirective } from '@energinet-datahub/dh/shared/util-release-toggle';

@Component({
  selector: 'dh-reports',
  imports: [
    TranslocoDirective,

    WATT_LINK_TABS,
    DhPermissionRequiredDirective,
    DhReleaseToggleDirective,
    VATER,
  ],
  template: `
    <watt-link-tabs vater inset="0" *transloco="let t; prefix: 'reports.tabs'">
      <ng-container *dhReleaseToggle="'PM31-REPORTS'">
        <watt-link-tab
          *dhPermissionRequired="['measurements-reports:manage']"
          [label]="t('measurementsReports')"
          [link]="getLink('measurements-reports')"
        />
      </ng-container>

      <watt-link-tab
        *dhPermissionRequired="['settlement-reports:manage']"
        [label]="t('settlementReports')"
        [link]="getLink('settlement-reports')"
      />

      <ng-container *dhReleaseToggle="'PM94-REPORTS'">
        <watt-link-tab
          *dhPermissionRequired="['metering-point-master-data-reports:manage']"
          [label]="t('meteringPointMasterDataReports')"
          [link]="getLink('overview')"
        />
      </ng-container>

      <watt-link-tab
        *dhPermissionRequired="['imbalance-prices:view']"
        [label]="t('imbalancePrices')"
        [link]="getLink('imbalance-prices')"
      />

      <ng-container *dhReleaseToggle="'MISSINGDATALOG'">
        <watt-link-tab
          *dhPermissionRequired="['missing-measurements-log:view']"
          [label]="t('missingMeasurementsLog')"
          [link]="getMissingMeasurementsLogLink('request')"
        />
      </ng-container>
    </watt-link-tabs>
  `,
})
export class DhReports {
  getLink = (path: ReportsSubPaths) => path;
  getMissingMeasurementsLogLink = (path: MissingMeasurementsLogSubPaths) =>
    this.getLink('missing-measurements-log') + '/' + path;
}
