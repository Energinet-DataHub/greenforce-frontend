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
import { Component, effect, inject, input, viewChild } from '@angular/core';
import { translate, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MutationResult } from 'apollo-angular';

import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDataTableComponent, WattDataActionsComponent } from '@energinet-datahub/watt/data';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetAdditionalRecipientOfMeasurementsDocument,
  RemoveMeteringPointsFromAdditionalRecipientDocument,
  RemoveMeteringPointsFromAdditionalRecipientMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-metering-point-ids-overview',
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WattDataTableComponent,
    WattDataActionsComponent,
    WattButtonComponent,
    WATT_TABLE,
  ],
  styles: `
    :host {
      display: block;
    }

    .download-button {
      margin-right: var(--watt-space-m);
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.accessToMeasurements'">
      <watt-data-table [enableCount]="false" variant="solid">
        <h3>{{ t('modalTitle') }}</h3>

        <watt-data-actions>
          <watt-button
            class="download-button"
            icon="download"
            variant="text"
            (click)="download()"
            >{{ 'shared.download' | transloco }}</watt-button
          >

          <ng-content />
        </watt-data-actions>

        <watt-table
          [dataSource]="tableDataSource"
          [columns]="columns"
          [sortClear]="false"
          [suppressRowHoverHighlight]="true"
          [selectable]="canManageAdditionalRecipients()"
        >
          <ng-container *wattTableToolbar="let selection">
            {{ t('table.selectedRows', { count: selection.length }) }}
            <watt-table-toolbar-spacer />
            <watt-button icon="close" (click)="submit(selection)" [loading]="submitInProgress()">
              {{ t('table.removeAccessToMeasurements') }}
            </watt-button>
          </ng-container>
        </watt-table>
      </watt-data-table>
    </ng-container>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhMeteringPointIdsOverview {
  private readonly toastService = inject(WattToastService);
  private readonly removeAccessMutation = mutation(
    RemoveMeteringPointsFromAdditionalRecipientDocument
  );
  tableDataSource = new WattTableDataSource<string>([]);

  table = viewChild.required(WattTableComponent);

  columns: WattTableColumnDef<string> = {
    meteringPointId: {
      accessor: (value) => value,
      header: translate('marketParticipant.accessToMeasurements.table.columns.meteringPointId'),
    },
  };

  data = input.required<string[]>();
  canManageAdditionalRecipients = input.required<boolean>();

  submitInProgress = this.removeAccessMutation.loading;

  constructor() {
    effect(() => (this.tableDataSource.data = this.data()));

    this.tableDataSource.filterPredicate = (data, filter) => data.includes(filter);
  }

  async submit(meteringPointIds: string[]) {
    if (this.submitInProgress()) {
      return;
    }

    const result = await this.removeAccessMutation.mutate({
      variables: {
        input: {
          meteringPointIds,
        },
      },
      refetchQueries: ({ data }) => {
        if (this.isUpdateSuccessful(data)) {
          return [GetAdditionalRecipientOfMeasurementsDocument];
        }

        return [];
      },
    });

    if (!this.isUpdateSuccessful(result.data)) {
      this.showErrorNotification();
    }
  }

  download(): void {
    if (!this.tableDataSource.sort) {
      return;
    }

    const dataSorted = this.tableDataSource.sortData(
      this.tableDataSource.filteredData,
      this.tableDataSource.sort
    );

    const headers = [
      `"${translate('marketParticipant.accessToMeasurements.table.columns.meteringPointId')}"`,
    ];
    const lines = dataSorted.map((meteringPointId) => [`"${meteringPointId}"`]);
    const fileName = `DataHub-Additional-recipients-of-measurements-${new Date().toISOString()}`;

    exportToCSV({ headers, lines, fileName });
  }

  private isUpdateSuccessful(
    mutationResult: MutationResult<RemoveMeteringPointsFromAdditionalRecipientMutation>['data']
  ): boolean {
    return !!mutationResult?.removeMeteringPointsFromAdditionalRecipient.success;
  }

  private showErrorNotification(): void {
    this.toastService.open({
      message: translate('marketParticipant.accessToMeasurements.removeRequestError'),
      type: 'danger',
    });
  }
}
