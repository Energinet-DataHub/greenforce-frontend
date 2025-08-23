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
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { DhMeasurementsReport } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-metering-point-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, TranslocoPipe],
  template: `
    <ng-container *transloco="let t; prefix: 'reports.measurementsReports'">
      @let meteringPointTypes = entry().meteringPointTypes;
      @let meteringPointIds = entry().meteringPointIds;

      @if (meteringPointIds) {
        @if (meteringPointIds.length < 4) {
          {{ meteringPointIds.join(', ') }}
        } @else {
          {{
            t('itemsAndCount', {
              items: meteringPointIds[0] + ', ' + meteringPointIds[1],
              remainingCount: meteringPointIds.length - 2,
            })
          }}
        }
      } @else if (meteringPointTypes.length < 4) {
        @for (meteringPointType of meteringPointTypes; let last = $last; track $index) {
          @if (last) {
            {{ 'meteringPointType.' + meteringPointType | transloco }}
          } @else {
            {{ 'meteringPointType.' + meteringPointType | transloco }},
          }
        }
      } @else {
        @let first = 'meteringPointType.' + meteringPointTypes[0] | transloco;
        @let second = 'meteringPointType.' + meteringPointTypes[1] | transloco;

        {{
          t('itemsAndCount', {
            items: first + ', ' + second,
            remainingCount: meteringPointTypes.length - 2,
          })
        }}
      }
    </ng-container>
  `,
})
export class DhMeteringPointCellComponent {
  entry = input.required<DhMeasurementsReport>();
}
