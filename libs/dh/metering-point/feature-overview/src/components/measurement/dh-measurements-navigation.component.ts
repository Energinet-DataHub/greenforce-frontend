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
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  WattSegmentedButtonComponent,
  WattSegmentedButtonsComponent,
} from '@energinet-datahub/watt/segmented-buttons';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { getPath, MeasurementsSubPaths } from '@energinet-datahub/dh/core/routing';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  selector: 'dh-measurements-navigation',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    TranslocoDirective,

    VaterStackComponent,
    RouterOutlet,
    DhFeatureFlagDirective,
    WattSegmentedButtonComponent,
    WattSegmentedButtonsComponent,
  ],
  styles: `
    :host {
      vater-stack {
        padding-top: var(--watt-space-ml);
      }

      .wrapper {
        position: relative;
        height: calc(100% - var(--watt-space-ml) * 3);
      }
    }
  `,
  template: `
    <vater-stack
      inset="m"
      gap="m"
      direction="row"
      justify="center"
      *transloco="let t; read: 'meteringPoint.measurements.navigation'"
    >
      <watt-segmented-buttons [formControl]="selectedView">
        <watt-segmented-button [value]="getLink('day')">{{ t('day') }}</watt-segmented-button>
        <watt-segmented-button [value]="getLink('month')">{{ t('month') }}</watt-segmented-button>
        <watt-segmented-button *dhFeatureFlag="'measurements-year'" [value]="getLink('year')">
          {{ t('year') }}
        </watt-segmented-button>
        <watt-segmented-button *dhFeatureFlag="'measurements-all'" [value]="getLink('all')">
          {{ t('all') }}
        </watt-segmented-button>
      </watt-segmented-buttons>
    </vater-stack>
    <div class="wrapper">
      <router-outlet />
    </div>
  `,
})
export class DhMeasurementsNavigationComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  getLink = (key: MeasurementsSubPaths) => getPath<MeasurementsSubPaths>(key);
  selectedView = new FormControl(this.route.snapshot.children[0].routeConfig?.path);

  navigateTo = toSignal(this.selectedView.valueChanges);

  constructor() {
    effect(() => {
      const navigateTo = this.navigateTo();

      if (navigateTo) {
        this.router.navigate([navigateTo], { relativeTo: this.route });
      }
    });
  }
}
