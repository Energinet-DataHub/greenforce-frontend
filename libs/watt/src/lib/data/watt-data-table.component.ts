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
import { Component, ContentChild, Input, ViewEncapsulation, inject } from '@angular/core';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WATT_CARD_VARIANT, WattCardComponent } from '@energinet-datahub/watt/card';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattTableComponent, WattPaginatorComponent } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { WattDataIntlService } from './watt-data-intl.service';

@Component({
  selector: 'watt-data-table',
  standalone: true,
  imports: [
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattCardComponent,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    WattSearchComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      watt-data-table h3,
      watt-data-table h4 {
        line-height: 44px;
        min-height: 44px;
        margin: 0;
      }

      watt-data-table watt-data-filters {
        min-height: 44px;
      }

      watt-data-table watt-paginator {
        display: block;
        margin: calc(-1 * var(--watt-space-m)) -24px -24px;
      }

      watt-data-table watt-table .mat-mdc-table tr.mdc-data-table__row:last-child .mat-mdc-cell {
        border-bottom: none;
      }

      .watt-data-table--empty-state {
        margin-bottom: var(--watt-space-m);
        overflow: auto;

        & > watt-empty-state {
          margin: auto;
        }
      }
    `,
  ],
  template: `
    <watt-card vater fill="vertical" [variant]="variant">
      <vater-flex fill="vertical" gap="m">
        <vater-stack direction="row" gap="m">
          <vater-stack direction="row" gap="s">
            <ng-content select="h3" />
            <ng-content select="h4" />
            <span class="watt-chip-label">{{ count ?? table.dataSource.data.length }}</span>
          </vater-stack>
          <vater-spacer />
          @if (enableSearch) {
            <watt-search [label]="intl.search" (search)="onSearch($event)" />
          }
          <ng-content select="watt-button" />
        </vater-stack>
        <ng-content select="watt-data-filters" />
        <vater-flex scrollable fill="vertical">
          <ng-content select="watt-table" />
          @if (!table.loading && table.dataSource.filteredData.length === 0) {
            <div class="watt-data-table--empty-state">
              <watt-empty-state
                [icon]="error ? 'custom-power' : 'cancel'"
                [title]="error ? intl.errorTitle : intl.emptyTitle"
                [message]="error ? intl.errorMessage : intl.emptyMessage"
              />
            </div>
          }
        </vater-flex>
        @if (enablePaginator) {
          <watt-paginator [for]="table.dataSource" />
        }
      </vater-flex>
    </watt-card>
  `,
})
export class WattDataTableComponent {
  @Input() error: unknown;
  @Input() enableSearch = true;
  @Input() enablePaginator = true;
  @Input() count?: number;
  @Input() variant: WATT_CARD_VARIANT = 'elevation';

  @ContentChild(WattTableComponent, { descendants: true })
  table!: WattTableComponent<unknown>;

  intl = inject(WattDataIntlService);

  onSearch(value: string) {
    this.table.dataSource.filter = value;
  }
}
