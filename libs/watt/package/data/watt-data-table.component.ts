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
  Component,
  ViewEncapsulation,
  contentChild,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import { WATT_CARD_VARIANT, WattCardComponent } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';
import { WattPaginatorComponent } from '@energinet/watt/paginator';
import { WattSearchComponent } from '@energinet/watt/search';
import { WattTableComponent } from '@energinet/watt/table';
import { WattIcon } from '@energinet/watt/icon';

import { WattDataIntlService } from './watt-data-intl.service';

@Component({
  selector: 'watt-data-table',
  imports: [
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattCardComponent,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    WattSearchComponent,
    WattButtonComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :root {
        --watt-data-table-empty-state-margin: auto;
      }

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
          margin: var(--watt-data-table-empty-state-margin);
        }
      }
    `,
  ],
  template: `
    <watt-card vater fill="vertical" [variant]="variant()">
      <vater-flex autoSize fill="vertical" gap="m">
        <vater-stack direction="row" gap="m">
          <vater-stack direction="row" gap="s">
            <ng-content select="h3" />
            <ng-content select="h4" />
            @if (enableCount()) {
              <span class="watt-chip-label">{{ count() ?? table().dataSource.totalCount }}</span>
            }
            @if (queryTime()) {
              <span class="watt-label">in {{ queryTime() }} ms</span>
            }
          </vater-stack>
          <ng-content />
          <vater-spacer />
          @if (enableSearch()) {
            <watt-search [label]="searchLabel() ?? intl.search" (search)="onSearch($event)" />
          }
          <ng-content select="watt-data-actions" />
          <ng-content select="watt-button" />
        </vater-stack>
        <ng-content select="watt-data-filters" />
        <vater-flex [autoSize]="autoSize()" fill="vertical">
          <ng-content select="watt-table" />
          @if (
            enableEmptyState() && !table().loading && table().dataSource.filteredData.length === 0
          ) {
            <div class="watt-data-table--empty-state">
              <watt-empty-state
                [icon]="error() ? 'custom-power' : ready() ? emptyStateIcon() : 'custom-explore'"
                [title]="error() ? intl.errorTitle : ready() ? intl.emptyTitle : intl.defaultTitle"
                [message]="error() ? intl.errorText : ready() ? intl.emptyText : intl.defaultText"
              >
                @if (enableRetry()) {
                  <watt-button variant="secondary" (click)="retry.emit()">{{
                    intl.emptyRetry
                  }}</watt-button>
                }
              </watt-empty-state>
            </div>
          }
        </vater-flex>
        @if (enablePaginator()) {
          <watt-paginator
            [for]="table().dataSource"
            [length]="count() ?? 0"
            (changed)="pageChanged.emit($event)"
          />
        }
      </vater-flex>
    </watt-card>
  `,
})
export class WattDataTableComponent {
  intl = inject(WattDataIntlService);

  error = input<unknown>();
  ready = input(true);
  enableSearch = input(true);
  enableRetry = input(false);
  enableCount = input(true);
  enableEmptyState = input(true);
  queryTime = input<number>();
  searchLabel = input<string>();
  enablePaginator = input(true);
  count = input<number>();
  autoSize = input(true);
  variant = input<WATT_CARD_VARIANT>('elevation');
  emptyStateIcon = input<WattIcon | 'custom-power' | 'custom-explore' | 'custom-no-results'>(
    'cancel'
  );

  clear = output();
  pageChanged = output<PageEvent>();
  retry = output();

  table = contentChild.required(WattTableComponent<unknown>, { descendants: true });

  search = viewChild(WattSearchComponent);
  reset = () => this.search()?.clear();

  onSearch(value: string) {
    this.table().dataSource.filter = value;
    if (!value) this.clear.emit();
  }
}
