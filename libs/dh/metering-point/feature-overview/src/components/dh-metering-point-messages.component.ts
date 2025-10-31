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
import { Component, computed, effect, input, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet/watt/chip';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { dayjs, WattDatePipe } from '@energinet/watt/date';

import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { ExtractNodeType, query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetArchivedMessagesForMeteringPointDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import {
  GetMarketParticipantOptionsDocument,
  SortEnumType,
  MeteringPointDocumentType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import { DhMessageArchiveSearchDetailsComponent } from '@energinet-datahub/dh/message-archive/feature-search';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
type ArchivedMessage = ExtractNodeType<GetArchivedMessagesForMeteringPointDataSource>;

@Component({
  selector: 'dh-metering-point-messages',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterUtilityDirective,
    VaterStackComponent,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDateRangeChipComponent,
    WattDatePipe,
    WattDropdownComponent,
    WattFormChipDirective,
    DhDropdownTranslatorDirective,
    DhMessageArchiveSearchDetailsComponent,
    DhPermissionRequiredDirective,
  ],
  template: `
    <dh-message-archive-search-details #details (close)="selection.set(undefined)" />
    <watt-data-table
      *transloco="let t; prefix: 'messageArchive'"
      vater
      inset="ml"
      [error]="dataSource.error"
      [header]="false"
    >
      <watt-data-filters>
        <form
          vater-stack
          scrollable
          direction="row"
          gap="s"
          tabindex="-1"
          [formGroup]="form"
          *transloco="let t; prefix: 'messageArchive.filters'"
        >
          <!-- period -->
          <watt-date-range-chip [formControl]="form.controls.created">
            {{ t('created') }}
          </watt-date-range-chip>

          <!-- document type -->
          <watt-dropdown
            [formControl]="form.controls.documentType"
            [chipMode]="true"
            [options]="documentTypeOptions"
            [placeholder]="t('documentType')"
            dhDropdownTranslator
            translateKey="messageArchive.documentType"
          />

          <!-- sender -->
          <watt-dropdown
            *dhPermissionRequired="['fas']"
            [formControl]="form.controls.senderId"
            [chipMode]="true"
            [options]="actorOptions()"
            [placeholder]="t('sender')"
          />

          <!-- receiver -->
          <watt-dropdown
            *dhPermissionRequired="['fas']"
            [formControl]="form.controls.receiverId"
            [chipMode]="true"
            [options]="actorOptions()"
            [placeholder]="t('receiver')"
          />
        </form>
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; prefix: 'messageArchive.columns'"
        #table
        description="Search result"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="selection.set($event)"
        (rowClick)="details.open($event)"
      >
        <ng-container *wattTableCell="columns['documentType']; let row">
          {{ t('documentType.' + row.documentType) }}
        </ng-container>
        <ng-container *wattTableCell="columns['sender']; let row">
          <div>
            {{ row.sender?.displayName }}
            <br />
            <span>{{ row.sender?.glnOrEicNumber }}</span>
          </div>
        </ng-container>
        <ng-container *wattTableCell="columns['receiver']; let row">
          <div>
            {{ row.receiver?.displayName }}
            <br />
            <span>{{ row.receiver?.glnOrEicNumber }}</span>
          </div>
        </ng-container>
        <ng-container *wattTableCell="columns['createdAt']; let row">
          {{ row.createdAt | wattDate: 'long' }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeteringPointMessagesComponent {
  private featureFlagsService = inject(DhFeatureFlagsService);

  meteringPointId = input.required<string>();
  selection = signal<ArchivedMessage | undefined>(undefined);

  columns: WattTableColumnDef<ArchivedMessage> = {
    createdAt: { accessor: 'createdAt' },
    documentType: { accessor: 'documentType', sort: false },
    sender: { accessor: (m) => m.sender?.displayName },
    receiver: { accessor: (m) => m.receiver?.displayName },
  };

  initialCreated = { start: dayjs().startOf('day').toDate(), end: dayjs().endOf('day').toDate() };
  form = new FormGroup({
    created: new FormControl(this.initialCreated, { nonNullable: true }),
    documentType: new FormControl<MeteringPointDocumentType | null>(null),
    senderId: new FormControl<string | null>(null),
    receiverId: new FormControl<string | null>(null),
  });

  updateChargeLinksDocumentTypes = [
    MeteringPointDocumentType.UpdateChargeLinks,
    MeteringPointDocumentType.ConfirmRequestChangeBillingMasterData,
    MeteringPointDocumentType.RejectRequestChangeBillingMasterData,
  ];

  documentTypeOptions = dhEnumToWattDropdownOptions(
    MeteringPointDocumentType,
    !this.featureFlagsService.isEnabled('update-charge-links')
      ? this.updateChargeLinksDocumentTypes
      : []
  );

  actorOptionsQuery = query(GetMarketParticipantOptionsDocument);
  actorOptions = computed(() => this.actorOptionsQuery.data()?.marketParticipants ?? []);

  filters = toSignal(this.form.valueChanges.pipe(filter((v) => Boolean(v.created?.end))));
  variables = computed(() => ({ ...this.filters(), meteringPointId: this.meteringPointId() }));
  dataSource = new GetArchivedMessagesForMeteringPointDataSource({
    skip: true,
    variables: {
      created: this.initialCreated,
      order: { createdAt: SortEnumType.Desc },
    },
  });

  refetch = effect(() => this.dataSource.refetch(this.variables()));
}
