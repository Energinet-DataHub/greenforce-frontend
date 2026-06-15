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
import { Component, computed, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import { WattToastService } from '@energinet/watt/toast';
import { WattModalService } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattDataTableComponent, WattDataActionsComponent } from '@energinet/watt/data';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhMarketParticipantExtended } from '@energinet-datahub/dh/market-participant/domain';
import { DhDownloadButtonComponent, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';

import {
  PermissionService,
  DhPermissionRequiredDirective,
} from '@energinet-datahub/dh/shared/feature-authorization';

import {
  GetMarketParticipantAuditLogsDocument,
  GetAdditionalRecipientOfMeasurementsDocument,
  RemoveMeteringPointsFromAdditionalRecipientDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhSetUpAccessToMeasurements } from './create/set-up-access-to-measurements';

@Component({
  selector: 'dh-access-to-measurements-tab',
  styles: [
    `
      :host {
        display: block;
      }

      .download-button {
        margin-right: var(--watt-space-m);
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    VaterFlexComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    DhPermissionRequiredDirective,
    WattDataTableComponent,
    WattDataActionsComponent,
    DhDownloadButtonComponent,
    WATT_TABLE,
  ],
  template: `
    <vater-flex *transloco="let t; prefix: 'marketParticipant.accessToMeasurements'">
      @if (isLoading()) {
        <vater-stack direction="row" justify="center">
          <watt-spinner />
        </vater-stack>
      } @else if (isEmpty()) {
        <vater-stack>
          <watt-empty-state
            [icon]="hasError() ? 'custom-power' : 'custom-no-results'"
            [title]="hasError() ? t('errorTitle') : t('emptyTitle')"
            [message]="hasError() ? t('errorMessage') : t('emptyMessage')"
          >
            @if (hasError() === false) {
              <watt-button
                *dhPermissionRequired="['additional-recipients:manage']"
                (click)="setUpAccessToMeasurements()"
                variant="secondary"
              >
                {{ t('emptyButton') }}
              </watt-button>
            }
          </watt-empty-state>
        </vater-stack>
      } @else {
        <watt-data-table [enableCount]="false" variant="solid" [autoSize]="true">
          <h3>{{ t('modalTitle') }}</h3>

          <watt-data-actions>
            <dh-download-button class="download-button" (click)="download()" />
            <watt-button
              *dhPermissionRequired="['additional-recipients:manage']"
              (click)="setUpAccessToMeasurements()"
              variant="secondary"
            >
              {{ t('emptyButton') }}
            </watt-button>
          </watt-data-actions>

          <watt-table
            [dataSource]="dataSource"
            [columns]="columns"
            [sortClear]="false"
            [suppressRowHoverHighlight]="true"
            [selectable]="canManageAdditionalRecipients()"
          >
            <ng-container *wattTableToolbar="let selection">
              <vater-stack direction="row" gap="xl">
                <span>{{ t('table.selectedRows', { count: selection.length }) }}</span>
                <watt-button
                  icon="close"
                  (click)="submit(selection)"
                  [loading]="removeAccessMutation.loading()"
                >
                  {{ t('table.removeAccessToMeasurements') }}
                </watt-button>
              </vater-stack>
            </ng-container>
          </watt-table>
        </watt-data-table>
      }
    </vater-flex>
  `,
})
export class DhAccessToMeasurementsTab {
  private readonly toastService = inject(WattToastService);
  private readonly modalService = inject(WattModalService);
  private readonly permissionService = inject(PermissionService);

  removeAccessMutation = mutation(RemoveMeteringPointsFromAdditionalRecipientDocument);

  private query = query(GetAdditionalRecipientOfMeasurementsDocument, () => ({
    variables: { marketParticipantId: this.marketParticipant().id },
  }));

  marketParticipant = input.required<DhMarketParticipantExtended>();

  data = computed<string[]>(
    () => this.query.data()?.marketParticipantById.additionalRecipientForMeasurements ?? []
  );

  columns: WattTableColumnDef<string> = {
    meteringPointId: {
      accessor: (value) => value,
      header: translate('marketParticipant.accessToMeasurements.table.columns.meteringPointId'),
    },
  };

  dataSource = dataSource(() => this.data());
  private readonly generateCSV = GenerateCSV.fromWattTableDataSource(this.dataSource);

  isLoading = this.query.loading;
  hasError = this.query.hasError;
  isEmpty = computed(() => this.data().length === 0);

  canManageAdditionalRecipients = toSignal(
    this.permissionService.hasPermission('additional-recipients:manage'),
    { initialValue: false }
  );

  setUpAccessToMeasurements(): void {
    this.modalService.open({
      component: DhSetUpAccessToMeasurements,
      data: this.marketParticipant(),
    });
  }

  async submit(meteringPointIds: string[]) {
    if (this.removeAccessMutation.loading()) {
      return;
    }

    const result = await this.removeAccessMutation.mutate({
      variables: {
        input: {
          marketParticipantId: this.marketParticipant().id,
          meteringPointIds,
        },
      },
      refetchQueries: [
        GetAdditionalRecipientOfMeasurementsDocument,
        GetMarketParticipantAuditLogsDocument,
      ],
    });

    if (!result.data?.removeMeteringPointsFromAdditionalRecipient.success) {
      this.showErrorNotification();
    }
  }

  download() {
    this.generateCSV
      .addHeaders([
        `"${translate('marketParticipant.accessToMeasurements.table.columns.meteringPointId')}"`,
      ])
      .mapLines((ids) => ids.map((meteringPointId) => [`"${meteringPointId}"`]))
      .generate('marketParticipant.accessToMeasurements.fileName');
  }

  private showErrorNotification(): void {
    this.toastService.open({
      message: translate('marketParticipant.accessToMeasurements.removeRequestError'),
      type: 'danger',
    });
  }
}
