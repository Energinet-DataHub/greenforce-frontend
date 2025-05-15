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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  DhFeatureFlagDirective,
  DhFeatureFlagsService,
} from '@energinet-datahub/dh/shared/feature-flags';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { WattNavListComponent, WattNavListItemComponent } from '@energinet-datahub/watt/shell';
import {
  WholesaleSubPaths,
  combinePaths,
  BasePaths,
  ReportsSubPaths,
} from '@energinet-datahub/dh/core/routing';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-primary-navigation',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  templateUrl: './dh-primary-navigation.component.html',
  imports: [
    TranslocoDirective,
    WattNavListComponent,
    WattNavListItemComponent,
    DhFeatureFlagDirective,
    DhPermissionRequiredDirective,
  ],
})
export class DhPrimaryNavigationComponent {
  featureFlags = inject(DhFeatureFlagsService);

  getLink(route: BasePaths) {
    return `/${route}`;
  }

  getWholesaleLink = (path: WholesaleSubPaths) => combinePaths('wholesale', path);
  getReportsLink = (path: ReportsSubPaths) => combinePaths('reports', path);
}
