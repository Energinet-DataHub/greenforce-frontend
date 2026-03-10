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
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  MeteringPointProcessState,
  OrchestrationState,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent, WattBadgeType } from '@energinet/watt/badge';

@Component({
  imports: [WattBadgeComponent],
  selector: 'dh-state-badge',
  template: `<watt-badge [type]="type()"><ng-content /></watt-badge>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhStateBadge {
  status = input<OrchestrationState | MeteringPointProcessState>();
  type = computed<WattBadgeType>(() => {
    switch (this.status()) {
      case 'scheduled':
      case 'pending':
      case 'canceled':
        return 'neutral';
      case 'running':
        return 'info';
      case 'failed':
      case 'rejected':
        return 'danger';
      case 'succeeded':
        return 'success';
      default:
        return 'skeleton';
    }
  });
}
