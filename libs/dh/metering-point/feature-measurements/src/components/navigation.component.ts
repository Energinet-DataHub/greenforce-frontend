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
import { Component, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, EventType, Router, RouterOutlet } from '@angular/router';

import qs from 'qs';
import { TranslocoDirective } from '@jsverse/transloco';
import { distinctUntilChanged, filter, map, mergeWith, of } from 'rxjs';

import {
  WattSegmentedButtonComponent,
  WattSegmentedButtonsComponent,
} from '@energinet-datahub/watt/segmented-buttons';

import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { dayjs } from '@energinet-datahub/watt/date';
import { getPath, MeasurementsSubPaths } from '@energinet-datahub/dh/core/routing';
@Component({
  selector: 'dh-measurements-navigation',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    TranslocoDirective,

    VaterUtilityDirective,
    VaterFlexComponent,
    VaterStackComponent,
    WattSegmentedButtonsComponent,
    WattSegmentedButtonComponent,
  ],
  template: `
    <vater-flex
      inset="ml"
      gap="ml"
      *transloco="let t; prefix: 'meteringPoint.measurements.navigation'"
    >
      @if (currentView() !== 'upload') {
        <vater-stack>
          <watt-segmented-buttons [formControl]="selectedView">
            <watt-segmented-button [value]="getLink('day')">{{ t('day') }}</watt-segmented-button>
            <watt-segmented-button [value]="getLink('month')">{{
              t('month')
            }}</watt-segmented-button>
            <watt-segmented-button [value]="getLink('year')">
              {{ t('year') }}
            </watt-segmented-button>
            <watt-segmented-button [value]="getLink('all')">
              {{ t('allYears') }}
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
export class DhMeasurementsNavigationComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routeOnLoad$ =
    this.route.firstChild?.url.pipe(map((url) => url.map((segment) => segment.path).join('/'))) ||
    of('');

  private routeOnNavigation$ = this.router.events.pipe(
    filter((event) => event.type === EventType.NavigationEnd),
    map((nav) => nav.urlAfterRedirects.split('/').pop()?.split('?')[0])
  );

  protected currentView = toSignal(
    this.routeOnLoad$.pipe(
      mergeWith(this.routeOnNavigation$),
      distinctUntilChanged(),
      takeUntilDestroyed()
    )
  );

  meteringPointId = input.required<string>();

  getLink = (key: MeasurementsSubPaths) => getPath(key);
  selectedView = new FormControl();

  navigateTo = toSignal(this.selectedView.valueChanges);

  constructor() {
    effect(() => {
      this.selectedView.setValue(this.currentView());
    });

    effect(() => {
      const navigateTo = this.navigateTo();
      const currentView = this.currentView();
      const params = new URLSearchParams(this.route.snapshot.queryParams['filters']);

      let filters = null;

      if (params.size > 0 && navigateTo === 'month' && currentView === 'day') {
        const date = params.get('date');
        const yearMonth = dayjs(date).format('YYYY-MM');
        filters = qs.stringify({ yearMonth });
      }

      if (params.size > 0 && navigateTo === 'year' && currentView === 'month') {
        const yearMonth = params.get('yearMonth');
        const year = dayjs(yearMonth).format('YYYY');
        filters = qs.stringify({ year });
      }

      if (navigateTo) {
        this.router.navigate([navigateTo], {
          relativeTo: this.route,
          queryParams: { filters },
          queryParamsHandling: 'merge',
        });
      }
    });
  }
}
