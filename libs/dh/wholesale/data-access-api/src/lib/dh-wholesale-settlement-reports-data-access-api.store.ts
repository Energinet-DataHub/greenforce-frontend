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
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  WholesaleProcessType,
  WholesaleSettlementReportHttp,
} from '@energinet-datahub/dh/shared/domain';

interface SettlementReportsState {
  isLoading: boolean;

  // Validation
  validation?: {
    errorMessage: string;
  };
}

interface DownloadRequest {
  gridAreas: string[];
  processType: WholesaleProcessType;
  periodStart: string;
  periodEnd: string;
  energySupplier: string | undefined;
  locale: string | undefined;
}

const initialState: SettlementReportsState = {
  isLoading: true,
};

@Injectable({ providedIn: 'root' })
export class DhWholesaleSettlementReportsDataAccessApiStore extends ComponentStore<SettlementReportsState> {
  isLoading$ = this.select((state) => state.isLoading);
  validationError$ = this.select((state) => state.validation);

  constructor(private httpClient: WholesaleSettlementReportHttp) {
    super(initialState);
  }

  download(downloadRequest: DownloadRequest, onErrorfn: () => void, onSuccess: () => void) {
    return this.httpClient
      .v1WholesaleSettlementReportDownloadGet(
        downloadRequest.gridAreas,
        downloadRequest.processType,
        downloadRequest.periodStart,
        downloadRequest.periodEnd,
        downloadRequest.energySupplier,
        downloadRequest.locale
      )
      .subscribe({
        next: (data) => {
          const blobPart = data as unknown as BlobPart;
          const blob = new Blob([blobPart], { type: 'application/zip' });
          const basisData = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = basisData;
          link.download = `SettlementReport.zip`;
          link.click();
          link.remove();
          onSuccess();
        },
        error: () => {
          onErrorfn();
        },
      });
  }
}
