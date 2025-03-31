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
import { Component, input } from '@angular/core';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import { RelatedMeteringPoints } from './types';
import { combineWithIdPaths, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dh-related-metering-points',
  imports: [WattCardComponent, RouterLink],
  template: `
    <watt-card>
      <ul>
        @let parent = relatedMeteringPoints()?.parent;

        @if (parent) {
          <li [routerLink]="getLink('master-data', parent.identification)">
            {{ parent.identification }}
          </li>
        }
        @for (
          meteringPoint of relatedMeteringPoints()?.relatedMeteringPoints;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.relatedByGsrn;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.historicalMeteringPoints;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.historicalMeteringPointsByGsrn;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }
      </ul>
    </watt-card>
  `,
})
export class DhRelatedMeteringPointsComponent {
  relatedMeteringPoints = input<RelatedMeteringPoints>();
  getLink = (path: MeteringPointSubPaths, id: string) =>
    combineWithIdPaths('metering-point', id, path);
}
