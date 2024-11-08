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
import { inject, Injectable } from '@angular/core';
import { translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  AddTokenToDownloadUrlDocument,
  GetSettlementReportDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhSettlementReportPartial } from './dh-settlement-report-partial';
import { dhSettlementReportName } from './dh-settlement-report-name';

@Injectable({
  providedIn: 'root',
})
export class DhSettlementReportsService {
  private toastService = inject(WattToastService);

  private addTokenToDownloadUrlMutation = mutation(AddTokenToDownloadUrlDocument);
  private settlementReportQuery = lazyQuery(GetSettlementReportDocument);

  async downloadReportFromNotification(settlementReportId: string) {
    const result = await this.settlementReportQuery.query({
      variables: {
        value: { id: settlementReportId },
      },
    });

    if (result.data.settlementReport) {
      this.downloadReport(result.data.settlementReport);
    }
  }

  async downloadReport(settlementReport: DhSettlementReportPartial) {
    let { settlementReportDownloadUrl } = settlementReport;

    if (!settlementReportDownloadUrl) {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });

      return;
    }

    settlementReportDownloadUrl = `${settlementReportDownloadUrl}&filename=${dhSettlementReportName(settlementReport)}`;

    const result = await this.addTokenToDownloadUrlMutation.mutate({
      variables: { url: settlementReportDownloadUrl },
    });

    const downloadUrl = result.data?.addTokenToDownloadUrl.downloadUrlWithToken;

    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.click();
      link.remove();
    }
  }
}
