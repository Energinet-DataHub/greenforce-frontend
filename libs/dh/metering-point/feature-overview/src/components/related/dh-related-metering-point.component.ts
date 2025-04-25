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
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { combineWithIdPaths, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import {
  ConnectionState,
  RelatedMeteringPointDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhMeteringPointStatusComponent } from '../dh-metering-point-status.component';

@Component({
  selector: 'dh-related-metering-point',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslocoPipe,

    WattDatePipe,
    VaterStackComponent,
    DhMeteringPointStatusComponent,
  ],
  styles: `
    :host {
      display: block;
      margin: 0 calc(var(--watt-space-ml) * -1);
      padding: var(--watt-space-m) var(--watt-space-ml);

      &:hover {
        cursor: pointer;
        background-color: var(--watt-color-neutral-grey-100);
      }
    }

    .metering-point {
      position: relative;
    }

    .metering-point__metadata {
      color: var(--watt-on-light-medium-emphasis);
    }

    .metering-point--selected::before {
      content: '';
      background-color: var(--watt-color-primary-light);
      position: absolute;
      top: calc(var(--watt-space-m) * -1);
      bottom: calc(var(--watt-space-m) * -1);
      left: calc(var(--watt-space-ml) * -1);
      width: 4px;
    }
  `,
  template: `
    <li
      vater-stack
      direction="row"
      align="center"
      justify="space-between"
      class="metering-point"
      [class.metering-point--selected]="isHighlighted()"
      [routerLink]="getLink('master-data', meteringPoint().identification)"
    >
      <vater-stack align="flex-start">
        {{ 'meteringPointType.' + meteringPoint().type | transloco }}

        <span class="metering-point__metadata">
          {{ meteringPoint().identification }}
        </span>

        <span class="metering-point__metadata">
          @if (isHistorical() && meteringPoint().connectionState === ConnectionState.ClosedDown) {
            {{ meteringPoint().connectionDate | wattDate }} ―
            {{ meteringPoint().closedDownDate | wattDate }}
          } @else {
            {{ meteringPoint().connectionDate | wattDate }}
          }
        </span>
      </vater-stack>

      <dh-metering-point-status [status]="meteringPoint().connectionState" />
    </li>
  `,
})
export class DhRelatedMeteringPointComponent {
  meteringPoint = input.required<RelatedMeteringPointDto>();
  isHighlighted = input<boolean>();
  isHistorical = input<boolean>();

  ConnectionState = ConnectionState;

  getLink = (path: MeteringPointSubPaths, id: string) =>
    combineWithIdPaths('metering-point', id, path);
}
