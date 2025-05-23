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
import type { ResultOf } from '@graphql-typed-document-node/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import {
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
} from '@energinet-datahub/watt/expandable-card';
import { GetMeteringPointsByGridAreaDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type Group = ResultOf<
  typeof GetMeteringPointsByGridAreaDocument
>['meteringPointsByGridAreaCode'][0];

@Component({
  selector: 'dh-metering-point-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    WattExpandableCardComponent,
    WattBadgeComponent,
    WattExpandableCardTitleComponent,
  ],
  template: `
    <watt-expandable-card
      variant="solid"
      *transloco="let t; read: 'meteringPointDebug.meteringPoints'"
    >
      <watt-badge>{{ group().meteringPoints.length }}</watt-badge>
      <watt-expandable-card-title
        >{{ t('packageNumber', { packageNumber: group().packageNumber }) }}
      </watt-expandable-card-title>

      @for (meteringPoint of group().meteringPoints; track meteringPoint.identification) {
        <p>{{ meteringPoint.identification }}</p>
      }
    </watt-expandable-card>
  `,
})
export class MeteringPointsGroupComponent {
  group = input.required<Group>();
}
