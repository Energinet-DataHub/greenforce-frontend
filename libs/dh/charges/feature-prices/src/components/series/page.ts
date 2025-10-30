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
import { RouterOutlet } from '@angular/router';
import { GetChargeResolutionDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { injectRelativeNavigate } from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_SEGMENTED_BUTTONS } from '@energinet-datahub/watt/segmented-buttons';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-charge-series-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VaterFlexComponent,
    VaterStackComponent,
    WATT_SEGMENTED_BUTTONS,
    RouterOutlet,
  ],
  template: `
    <vater-flex inset="ml" gap="ml" *transloco="let t; prefix: 'charges.series'">
      @if (hasMultipleViews()) {
        <vater-stack>
          <watt-segmented-buttons (selectedChange)="navigate($event)">
            <watt-segmented-button value="day">
              {{ t('day') }}
            </watt-segmented-button>
            <watt-segmented-button value="week">
              {{ t('week') }}
            </watt-segmented-button>
          </watt-segmented-buttons>
        </vater-stack>
      }

      <vater-flex fill="vertical">
        <router-outlet />
      </vater-flex>
    </vater-flex>
  `,
})
export class DhChargeSeriesPage {
  id = input.required<string>();
  navigate = injectRelativeNavigate();
  resolution = query(GetChargeResolutionDocument, () => ({ variables: { id: this.id() } }));
  hasMultipleViews = computed(() => {
    switch (this.resolution.data()?.chargeById?.resolution) {
      case 'Hourly':
      case 'QuarterHourly':
        return true;
      default:
        return false;
    }
  });
}
