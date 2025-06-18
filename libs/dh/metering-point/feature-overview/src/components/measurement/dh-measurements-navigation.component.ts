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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, EventType, Router, RouterLink, RouterOutlet } from '@angular/router';

import { TranslocoDirective } from '@jsverse/transloco';
import { distinctUntilChanged, filter, map, mergeWith, of } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WattSegmentedButtonComponent,
  WattSegmentedButtonsComponent,
} from '@energinet-datahub/watt/segmented-buttons';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { getPath, MeasurementsSubPaths } from '@energinet-datahub/dh/core/routing';
import { DhMeasurementsUploadDataService } from './dh-measurements-upload-data.service';

@Component({
  selector: 'dh-measurements-navigation',
  imports: [
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    WattSegmentedButtonComponent,
    WattSegmentedButtonsComponent,
    WattButtonComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    VaterFlexComponent,
  ],
  providers: [DhMeasurementsUploadDataService],
  template: `
    <vater-flex
      inset="ml"
      gap="ml"
      *transloco="let t; read: 'meteringPoint.measurements.navigation'"
    >
      @if (currentView() !== 'upload') {
        <vater-flex gap="m" direction="row">
          <vater-spacer />
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
          <vater-stack direction="row" justify="end">
            <watt-button [routerLink]="getLink('upload')" variant="secondary">
              {{ t('upload') }}
            </watt-button>
          </vater-stack>
        </vater-flex>
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

  getLink = (key: MeasurementsSubPaths) => getPath(key);
  selectedView = new FormControl();

  navigateTo = toSignal(this.selectedView.valueChanges);

  constructor() {
    effect(() => {
      this.selectedView.setValue(this.currentView());
    });
    effect(() => {
      const navigateTo = this.navigateTo();

      if (navigateTo) {
        this.router.navigate([navigateTo], { relativeTo: this.route });
      }
    });
  }
}
