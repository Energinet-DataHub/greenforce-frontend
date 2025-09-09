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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';

import { DhGridAreaStatusBadgeComponent } from './status-badge.component';
import { DhAuditLogComponent } from './audit-log.component';
import { lazyQuery, query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetGridAreaDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import type { ResultOf } from '@graphql-typed-document-node/core';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

export type GridArea = ResultOf<typeof GetGridAreaDetailsDocument>['gridAreaOverviewItemById'];

@Component({
  selector: 'dh-grid-area-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
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
      autoOpen
      [key]="gridArea()?.id"
      (closed)="closed()"
      *transloco="let t; prefix: 'marketParticipant.gridAreas'"
    >
      @if (gridAreaView) {
        <watt-drawer-topbar>
          <dh-gridarea-status-badge [status]="gridAreaView.status" />
        </watt-drawer-topbar>
      }

      @if (gridAreaView) {
        <watt-drawer-heading>
          <h2 class="watt-space-stack-s">{{ gridAreaView.code }}</h2>

          <vater-stack wrap direction="row" gap="ml">
            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.actor') }}</span>
              <span>{{ gridAreaView.actor }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.organization') }}</span>
              <span>{{ gridAreaView.organizationName }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.priceArea') }}</span>
              <span>{{ gridAreaView.priceAreaCode }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.type') }}</span>
              <span>{{ t('types.' + gridAreaView.type) }}</span>
            </vater-stack>

            <vater-stack direction="row" gap="s">
              <span class="watt-label">{{ t('columns.period') }}</span>
              <span>{{ period() | wattDate }}</span>
            </vater-stack>
          </vater-stack>
        </watt-drawer-heading>
      }

      @if (drawer.isOpen() && gridAreaView) {
        <watt-drawer-content>
          <dh-audit-log [gridArea]="gridAreaView" />
        </watt-drawer-content>
      }
    </watt-drawer>
  `,
})
export class DhGridAreaDetailsComponent {
  private navigation = inject(DhNavigationService);
  private query = query(GetGridAreaDetailsDocument, () => ({ variables: { id: this.id() } }));

  id = input.required<string>();

  gridArea = computed(() => this.query.data()?.gridAreaOverviewItemById);
  period = computed(() => {
    const gridArea = this.gridArea();

    if (gridArea === undefined) {
      return null;
    }

    return { start: gridArea.validFrom, end: gridArea.validTo ?? null };
  });

  closed() {
    this.navigation.navigate('list');
  }
}
