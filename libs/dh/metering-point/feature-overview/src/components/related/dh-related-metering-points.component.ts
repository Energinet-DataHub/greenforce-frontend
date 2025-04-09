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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattCardComponent, WattCardTitleComponent } from '@energinet-datahub/watt/card';
import { combineWithIdPaths, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhRelatedMeteringPointComponent } from './dh-related-metering-point.component';
import { RelatedMeteringPoints } from '../../types';

@Component({
  selector: 'dh-related-metering-points',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,

    VaterStackComponent,
    WattCardComponent,
    WattCardTitleComponent,
    DhRelatedMeteringPointComponent,
  ],
  styles: `
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .related-by-gsrn {
      border-top: 1px solid var(--watt-color-neutral-grey-300);
      border-bottom: 1px solid var(--watt-color-neutral-grey-300);
    }

    dh-related-metering-point + h4 {
      margin: var(--watt-space-m) 0 var(--watt-space-s);
    }
  `,
  template: `
    <watt-card>
      <watt-card-title>
        <h3>{{ 'meteringPoint.relatedMeteringPointsTitle' | transloco }}</h3>
      </watt-card-title>

      <ul vater-stack align="stretch">
        @let parent = relatedMeteringPoints()?.parent;

        @if (parent) {
          <dh-related-metering-point
            [meteringPoint]="parent"
            [isHighlighted]="meteringPointId() === parent.identification"
          />
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.relatedMeteringPoints;
          track meteringPoint.identification
        ) {
          <dh-related-metering-point
            [meteringPoint]="meteringPoint"
            [isHighlighted]="meteringPointId() === meteringPoint.identification"
          />
        }

        @if (relatedMeteringPoints()?.relatedByGsrn?.length) {
          @for (
            meteringPoint of relatedMeteringPoints()?.relatedByGsrn;
            track meteringPoint.identification
          ) {
            <dh-related-metering-point
              class="related-by-gsrn"
              [meteringPoint]="meteringPoint"
              [isHighlighted]="meteringPointId() === meteringPoint.identification"
            />
          }
        }

        @if (
          relatedMeteringPoints()?.historicalMeteringPoints?.length ||
          relatedMeteringPoints()?.historicalMeteringPointsByGsrn?.length
        ) {
          <h4>{{ 'meteringPoint.historicalMeteringPoints' | transloco }}</h4>
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.historicalMeteringPoints;
          track meteringPoint.identification
        ) {
          <dh-related-metering-point
            [meteringPoint]="meteringPoint"
            [isHighlighted]="meteringPointId() === meteringPoint.identification"
            [isHistorical]="true"
          />
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.historicalMeteringPointsByGsrn;
          track meteringPoint.identification
        ) {
          <dh-related-metering-point
            [meteringPoint]="meteringPoint"
            [isHighlighted]="meteringPointId() === meteringPoint.identification"
            [isHistorical]="true"
          />
        }
      </ul>
    </watt-card>
  `,
})
export class DhRelatedMeteringPointsComponent {
  relatedMeteringPoints = input<RelatedMeteringPoints>();
  meteringPointId = input<string>();

  getLink = (path: MeteringPointSubPaths, id: string) =>
    combineWithIdPaths('metering-point', id, path);
}
