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
import { Component, effect, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dh-settlement-report-drawer-v2',
  standalone: true,
  imports: [WATT_DRAWER],
  template: `
    <watt-drawer (closed)="onClose()">
      <watt-drawer-heading>{{ id() }} </watt-drawer-heading>

      <watt-drawer-content>Content goes here</watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhSettlementReportDrawerV2Component {
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);

  drawer = viewChild.required<WattDrawerComponent>(WattDrawerComponent);

  id = toSignal<string>(this.activeRoute.params.pipe(map((p) => p['id'] ?? undefined)));

  openDrawerEffect = effect(() => {
    const id = this.id();

    this.drawer().open();
  });

  onClose() {
    this.router.navigate(['../'], { relativeTo: this.activeRoute });
  }
}
