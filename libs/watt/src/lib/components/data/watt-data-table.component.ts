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
import { NgIf } from '@angular/common';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '../vater';

import { WattCardComponent } from '../card';
import { WattSearchComponent } from '../search';
import { WattTableComponent } from '../table';
import { WattPaginatorComponent } from '../paginator';
import { WattEmptyStateComponent } from '../empty-state';

import { WattDataIntlService } from './watt-data-intl.service';

@Component({
  selector: 'watt-data-table',
  standalone: true,
  imports: [
    NgIf,
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
    <watt-card vater fill="vertical">
      <vater-flex fill="vertical" gap="m">
        <vater-stack direction="row" gap="m">
          <vater-stack direction="row" gap="s">
            <ng-content select="h3" />
            <ng-content select="h4" />
            <span class="watt-chip-label">{{ count ?? this.table.dataSource.data.length }}</span>
          </vater-stack>
          <vater-spacer />
          <watt-search *ngIf="enableSearch" [label]="intl.search" (search)="onSearch($event)" />
          <ng-content select="watt-button" />
        </vater-stack>
        <ng-content select="watt-data-filters" />
        <vater-flex scrollable fill="vertical">
          <ng-content select="watt-table" />
          <div
            *ngIf="!table.loading && this.table.dataSource.filteredData.length === 0"
            class="watt-data-table--empty-state"
          >
            <watt-empty-state
              [icon]="error ? 'custom-power' : 'cancel'"
              [title]="error ? intl.errorTitle : intl.emptyTitle"
              [message]="error ? intl.errorMessage : intl.emptyMessage"
            />
          </div>
        </vater-flex>
        <watt-paginator [for]="this.table.dataSource" />
      </vater-flex>
    </watt-card>
  `,
})
export class WattDataTableComponent {
  @Input() error: unknown;
  @Input() enableSearch = true;
  @Input() count?: number;

  @ContentChild(WattTableComponent, { descendants: true })
  table!: WattTableComponent<unknown>;

  intl = inject(WattDataIntlService);

  onSearch(value: string) {
    this.table.dataSource.filter = value;
  }
}
