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
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, Subject, map, tap, filter } from 'rxjs';

import {
  WholesaleBatchHttp,
  MarketParticipantGridAreaHttp,
  WholesaleBatchRequestDto,
  WholesaleProcessType,
  MarketParticipantGridAreaDto,
  MarketParticipantHttp,
  WholesaleSettlementReportHttp,
  MarketParticipantFilteredActorDto,
} from '@energinet-datahub/dh/shared/domain';

interface State {
  gridAreas?: MarketParticipantGridAreaDto[];
  loadingBatches: boolean;
  loadingSettlementReports: boolean;
  selectedGridArea?: MarketParticipantGridAreaDto;
  loadingCreatingBatch: boolean;
  filteredActors?: MarketParticipantFilteredActorDto[];
}

const initialState: State = {
  loadingBatches: false,
  loadingSettlementReports: false,
  loadingCreatingBatch: false,
};

@Injectable({
  providedIn: 'root',
})
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
  gridAreas$ = this.select((x) => x.gridAreas).pipe(
    // Ensure gridAreas$ will not emit undefined, which will cause no loading indicator to be shown
    filter((x) => !!x)
  );
  selectedGridArea$ = this.select((x) => x.selectedGridArea);
  filteredActors$ = this.select((x) => x.filteredActors);

  creatingBatchSuccessTrigger$: Subject<void> = new Subject();
  creatingBatchErrorTrigger$: Subject<void> = new Subject();

  loadingCreatingBatch$ = this.select((x) => x.loadingCreatingBatch);
  loadingBatches$ = this.select((x) => x.loadingBatches);
  loadingSettlementReports$ = this.select((x) => x.loadingSettlementReports);
  loadingGridAreasErrorTrigger$: Subject<void> = new Subject();
  loadingBatchesErrorTrigger$: Subject<void> = new Subject();
  loadingBatchErrorTrigger$: Subject<void> = new Subject();
  loadingBasisDataErrorTrigger$: Subject<void> = new Subject();
  loadingSettlementReportDataErrorTrigger$: Subject<void> = new Subject();
  loadingProcessStepResultsErrorTrigger$: Subject<void> = new Subject();
  loadingActorsErrorTrigger$: Subject<void> = new Subject();
  loadingFilteredActorsErrorTrigger$: Subject<void> = new Subject();

  private document = inject(DOCUMENT);
  private httpClient = inject(WholesaleBatchHttp);
  private marketParticipantGridAreaHttpClient = inject(MarketParticipantGridAreaHttp);
  private marketParticipantHttp = inject(MarketParticipantHttp);
  private wholesaleSettlementReportHttp = inject(WholesaleSettlementReportHttp);

  constructor() {
    super(initialState);
  }

  readonly setLoadingCreatingBatch = this.updater(
    (state, loadingCreatingBatch: boolean): State => ({
      ...state,
      loadingCreatingBatch,
    })
  );

  readonly setLoadingBatches = this.updater(
    (state, loadingBatches: boolean): State => ({
      ...state,
      loadingBatches,
    })
  );

  readonly setLoadingSettlementReports = this.updater(
    (state, loadingBatches: boolean): State => ({
      ...state,
      loadingBatches,
    })
  );

  readonly setFilteredActors = this.updater(
    (state, filteredActors: MarketParticipantFilteredActorDto[]): State => ({
      ...state,
      filteredActors,
    })
  );

  readonly setGridAreas = this.updater(
    (state, gridAreas: MarketParticipantGridAreaDto[]): State => ({
      ...state,
      gridAreas,
    })
  );

  readonly createBatch = this.effect(
    (
      batch$: Observable<{
        gridAreas: string[];
        dateRange: { start: string; end: string };
        processType: WholesaleProcessType;
      }>
    ) => {
      return batch$.pipe(
        switchMap((batch) => {
          this.setLoadingCreatingBatch(true);

          const batchRequest: WholesaleBatchRequestDto = {
            processType: batch.processType,
            gridAreaCodes: batch.gridAreas,
            startDate: batch.dateRange.start,
            endDate: batch.dateRange.end,
          };

          return this.httpClient.v1WholesaleBatchPost(batchRequest).pipe(
            tapResponse(
              () => {
                this.creatingBatchSuccessTrigger$.next();
                this.setLoadingCreatingBatch(false);
              },
              () => {
                this.creatingBatchErrorTrigger$.next();
                this.setLoadingCreatingBatch(false);
              }
            )
          );
        })
      );
    }
  );

  readonly getGridAreas = this.effect(() => {
    return this.marketParticipantGridAreaHttpClient
      .v1MarketParticipantGridAreaGetAllGridAreasGet()
      .pipe(
        tapResponse(
          (gridAreas) => {
            this.setGridAreas(gridAreas);
          },
          () => this.loadingGridAreasErrorTrigger$.next()
        )
      );
  });

  readonly getFilteredActors = this.effect(() => {
    return this.marketParticipantHttp.v1MarketParticipantOrganizationGetFilteredActorsGet().pipe(
      tapResponse(
        (filtedActors) => {
          this.setFilteredActors(filtedActors);
        },
        () => this.loadingFilteredActorsErrorTrigger$.next()
      )
    );
  });

  readonly downloadSettlementReportData = this.effect(
    (options$: Observable<{ batchNumber: string; gridAreaCode: string }>) => {
      return options$.pipe(
        switchMap((options) => {
          return this.wholesaleSettlementReportHttp
            .v1WholesaleSettlementReportGet(options.batchNumber, options.gridAreaCode)
            .pipe(
              tapResponse(
                (data) => {
                  const blob = new Blob([data as unknown as BlobPart], {
                    type: 'application/zip',
                  });
                  const basisData = window.URL.createObjectURL(blob);
                  const link = this.document.createElement('a');
                  link.href = basisData;
                  link.download = `${options.batchNumber}.zip`;
                  link.click();
                },
                () => this.loadingSettlementReportDataErrorTrigger$.next()
              )
            );
        })
      );
    }
  );

  readonly setSelectedGridArea = this.updater(
    (state, gridArea: MarketParticipantGridAreaDto | undefined): State => ({
      ...state,
      selectedGridArea: gridArea,
    })
  );
}
