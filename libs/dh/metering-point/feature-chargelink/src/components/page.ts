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
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, EventType, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_SEGMENTED_BUTTONS } from '@energinet/watt/segmented-buttons';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { ChargeLinksSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { distinctUntilChanged, filter, map, mergeWith, of } from 'rxjs';

@Component({
  selector: 'dh-metering-point-charge-links',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    TranslocoDirective,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_SEGMENTED_BUTTONS,
  ],
  providers: [DhNavigationService],
  template: ` <vater-flex
    inset="ml"
    gap="ml"
    *transloco="let t; prefix: 'meteringPoint.charges.navigation'"
  >
    <vater-stack>
      <watt-segmented-buttons [formControl]="selectedView">
        <watt-segmented-button [value]="getLink('tariff-and-subscription')">{{
          t('tariffAndSubscription')
        }}</watt-segmented-button>
        <watt-segmented-button [value]="getLink('fees')">{{ t('fees') }}</watt-segmented-button>
      </watt-segmented-buttons>
    </vater-stack>

    <vater-flex fill="vertical">
      <router-outlet />
    </vater-flex>
  </vater-flex>`,
})
export default class DhMeteringPointChargeLinkPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  selectedView = new FormControl();

  getLink = (key: ChargeLinksSubPaths) => getPath(key);

  navigateTo = toSignal(this.selectedView.valueChanges);

  private routeOnLoad$ =
    this.route.firstChild?.url.pipe(map((url) => url.map((segment) => segment.path).join('/'))) ||
    of('');

  private routeOnNavigation$ = this.router.events.pipe(
    filter((event) => event.type === EventType.NavigationEnd),
    map((nav) => nav.urlAfterRedirects.split('/').pop()?.split('?')[0])
  );

  protected currentView = toSignal<ChargeLinksSubPaths>(
    this.routeOnLoad$.pipe(
      mergeWith(this.routeOnNavigation$),
      distinctUntilChanged(),
      map((route) => route as ChargeLinksSubPaths),
      takeUntilDestroyed()
    )
  );

  constructor() {
    effect(() => {
      this.selectedView.setValue(this.currentView());
    });

    effect(() => {
      this.router.navigate([this.navigateTo()], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
      });
    });
  }
}
