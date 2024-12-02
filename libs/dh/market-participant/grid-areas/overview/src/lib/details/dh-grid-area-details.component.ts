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
import { Component, effect, input, output, viewChild } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhGridAreaRow } from '@energinet-datahub/dh/market-participant/grid-areas/domain';

import { DhGridAreaStatusBadgeComponent } from '../dh-grid-area-status-badge.component';
import { DhAuditLogComponent } from './dh-audit-log.component';

@Component({
  selector: 'dh-grid-area-details',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    VaterFlexComponent,
    VaterStackComponent,
    WattDatePipe,
    WATT_DRAWER,
    DhGridAreaStatusBadgeComponent,
    DhAuditLogComponent,
  ],
  template: `
    @let gridAreaView = gridArea();

    <watt-drawer
      #drawer
      (closed)="closed.emit()"
      *transloco="let t; read: 'marketParticipant.gridAreas'"
    >
      @if (gridAreaView) {
        <watt-drawer-topbar>
          <dh-gridarea-status-badge [status]="gridAreaView.status" />
        </watt-drawer-topbar>
      }

      @if (gridAreaView) {
        <watt-drawer-heading>
          <h2 class="watt-space-stack-s">{{ gridAreaView.code }}</h2>

          <vater-flex direction="row" wrap="wrap" gap="ml" grow="0">
            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.actor') }}</span>
              <span>{{ gridAreaView.actor }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.organization') }}</span>
              <span>{{ gridAreaView.organization }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.priceArea') }}</span>
              <span>{{ gridAreaView.priceArea }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.type') }}</span>
              <span>{{ t('types.' + gridAreaView.type) }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.period') }}</span>
              <span>{{ gridAreaView.period | wattDate }}</span>
            </vater-stack>
          </vater-flex>
        </watt-drawer-heading>
      }

      @if (drawer.isOpen && gridAreaView) {
        <watt-drawer-content>
          <dh-audit-log [gridAreaId]="gridAreaView.id" />
        </watt-drawer-content>
      }
    </watt-drawer>
  `,
})
export class DhGridAreaDetailsComponent {
  private drawer = viewChild.required(WattDrawerComponent);

  gridArea = input<DhGridAreaRow>();

  closed = output();

  constructor() {
    effect(() => {
      if (this.gridArea()) {
        this.drawer().open();
      }
    });
  }
}
