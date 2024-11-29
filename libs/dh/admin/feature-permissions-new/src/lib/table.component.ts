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
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, output } from '@angular/core';

import { switchMap } from 'rxjs';
import { translate, TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { exportToCSV, streamToFile } from '@energinet-datahub/dh/shared/ui-util';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { GetPermissionsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  standalone: true,
  selector: 'dh-permissions-table',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }
    `,
  ],
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattSearchComponent,
    WattButtonComponent,
    WattEmptyStateComponent,

    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,

    DhPermissionRequiredDirective,
  ],
  template: `<watt-card
    vater
    inset="ml"
    *transloco="let t; read: 'admin.userManagement.permissionsTab'"
  >
    <vater-flex fill="vertical" gap="m">
      <vater-stack direction="row" gap="s">
        <h3>{{ t('headline') }}</h3>
        <span class="watt-chip-label">{{ dataSource.data.length }}</span>

        <vater-spacer />

        <watt-search [label]="'shared.search' | transloco" (search)="onSearch($event)" />

        <watt-button *transloco="let t" icon="download" variant="text" (click)="exportAsCsv()">
          {{ t('shared.download') }}
        </watt-button>

        <watt-button
          *dhPermissionRequired="['user-roles:manage']"
          icon="download"
          variant="text"
          (click)="downloadRelationCSV(url())"
        >
          {{ 'shared.downloadreport' | transloco }}
        </watt-button>
      </vater-stack>

      <vater-flex fill="vertical" scrollable>
        <watt-table
          [dataSource]="dataSource"
          [columns]="columns"
          (rowClick)="onRowClick($event)"
          [activeRow]="activeRow"
          sortBy="name"
          sortDirection="asc"
          [sortClear]="false"
          [loading]="loading()"
        >
          <ng-container *wattTableCell="columns.name; header: t('permissionName'); let element">
            {{ element.name }}
          </ng-container>

          <ng-container
            *wattTableCell="columns.description; header: t('permissionDescription'); let element"
          >
            {{ element.description }}
          </ng-container>
        </watt-table>

        @if (hasError()) {
          <vater-stack fill="vertical" justify="center">
            <watt-empty-state
              icon="custom-power"
              [title]="'shared.error.title' | transloco"
              [message]="'shared.error.message' | transloco"
            />
          </vater-stack>
        }
      </vater-flex>
    </vater-flex>
  </watt-card>`,
})
export class DhPermissionsTableComponent {
  private readonly toastService = inject(WattToastService);
  private readonly httpClient = inject(HttpClient);

  open = output<PermissionDto>();

  query = query(GetPermissionsDocument, { variables: { searchTerm: '' } });
  loading = this.query.loading;
  hasError = this.query.hasError;

  columns: WattTableColumnDef<PermissionDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new WattTableDataSource<PermissionDto>([]);
  activeRow: PermissionDto | undefined = undefined;

  url = computed(() => this.query.data()?.permissions.getPermissionRelationsUrl ?? '');

  constructor() {
    effect(() => {
      this.dataSource.data = this.query.data()?.permissions.permissions ?? [];
    });
  }

  onRowClick(row: PermissionDto): void {
    this.activeRow = row;
    this.open.emit(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }

  onSearch(value: string): void {
    this.dataSource.filter = value;
  }

  exportAsCsv(): void {
    if (this.dataSource.sort) {
      const basePath = 'admin.userManagement.permissionsTab.';
      const headers = [
        `"${translate(basePath + 'permissionName')}"`,
        `"${translate(basePath + 'permissionDescription')}"`,
      ];

      const marketRoles = this.dataSource.sortData(
        [...this.dataSource.filteredData],
        this.dataSource.sort
      );

      const lines = marketRoles.map((x) => [`"${x.name}"`, `"${x.description}"`]);

      exportToCSV({ headers, lines });
    }
  }

  downloadRelationCSV(url: string) {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'permissions-relation-report',
      type: 'text/csv',
    };

    this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
  }
}
