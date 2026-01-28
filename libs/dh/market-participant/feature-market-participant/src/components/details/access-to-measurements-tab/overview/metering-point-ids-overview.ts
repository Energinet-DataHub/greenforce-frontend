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
import { ApolloLink } from '@apollo/client';

import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet/watt/table';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattToastService } from '@energinet/watt/toast';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDataTableComponent, WattDataActionsComponent } from '@energinet/watt/data';

import { GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

import {
  GetMarketParticipantAuditLogsDocument,
  GetAdditionalRecipientOfMeasurementsDocument,
  RemoveMeteringPointsFromAdditionalRecipientDocument,
  RemoveMeteringPointsFromAdditionalRecipientMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-ids-overview',
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
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
    <ng-container *transloco="let t; prefix: 'marketParticipant.accessToMeasurements'">
      <watt-data-table [enableCount]="false" variant="solid" [autoSize]="true">
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
            <vater-stack direction="row" gap="xl">
              <span>{{ t('table.selectedRows', { count: selection.length }) }}</span>
              <watt-button icon="close" (click)="submit(selection)" [loading]="submitInProgress()">
                {{ t('table.removeAccessToMeasurements') }}
              </watt-button>
            </vater-stack>
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
  private readonly geneateCSV = GenerateCSV.fromWattTableDataSource(this.tableDataSource);

  table = viewChild.required(WattTableComponent);

  columns: WattTableColumnDef<string> = {
    meteringPointId: {
      accessor: (value) => value,
      header: translate('marketParticipant.accessToMeasurements.table.columns.meteringPointId'),
    },
  };

  data = input.required<string[]>();
  actorId = input.required<string>();
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
          marketParticipantId: this.actorId(),
          meteringPointIds,
        },
      },
      refetchQueries: ({ data }) => {
        if (this.isUpdateSuccessful(data)) {
          return [
            GetAdditionalRecipientOfMeasurementsDocument,
            GetMarketParticipantAuditLogsDocument,
          ];
        }

        return [];
      },
    });

    if (!this.isUpdateSuccessful(result.data)) {
      this.showErrorNotification();
    }
  }

  download() {
    this.geneateCSV
      .addHeaders([
        `"${translate('marketParticipant.accessToMeasurements.table.columns.meteringPointId')}"`,
      ])
      .mapLines((ids) => ids.map((meteringPointId) => [`"${meteringPointId}"`]))
      .generate('marketParticipant.accessToMeasurements.fileName');
  }

  private isUpdateSuccessful(
    mutationResult: ApolloLink.Result<RemoveMeteringPointsFromAdditionalRecipientMutation>['data']
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
