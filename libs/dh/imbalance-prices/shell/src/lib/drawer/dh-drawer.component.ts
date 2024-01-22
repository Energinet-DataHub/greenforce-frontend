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
import { Component, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import { DhImbalancePrice } from '../dh-imbalance-prices';
import { DhStatusBadgeComponent } from '../status-badge/dh-status-badge.component';
import { monthViewMock } from './dh-month-view.mock';

@Component({
  selector: 'dh-imbalance-prices-drawer',
  standalone: true,
  templateUrl: './dh-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h2 {
        margin-bottom: var(--watt-space-s);
      }

      .entry-metadata {
        display: flex;
        gap: var(--watt-space-ml);
      }

      .entry-metadata__item {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }

      .prices-note {
        color: var(--watt-color-neutral-grey-700);
        margin-top: 0;
      }

      watt-drawer-content {
        padding-right: var(--watt-space-ml);
        padding-left: var(--watt-space-ml);
      }

      watt-expandable-card {
        display: block;

        &:not(:first-of-type) {
          margin-top: var(--watt-space-s);
        }
      }

      watt-expandable-card-title {
        display: contents;

        dh-status-badge {
          margin-left: auto;
        }
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WATT_DRAWER,
    WattDatePipe,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    DhStatusBadgeComponent,
    DhEmDashFallbackPipe,
  ],
})
export class DhImbalancePricesDrawerComponent {
  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  entry: DhImbalancePrice | null = null;
  monthView = signal(monthViewMock);

  @Input() set imbalancePrice(value: DhImbalancePrice | undefined) {
    if (value) {
      this.drawer?.open();
      this.entry = value;
    } else {
      this.onClose();
    }
  }

  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.entry = null;

    this.closed.emit();
  }
}
