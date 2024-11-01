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
import { wattFormatDate } from '@energinet-datahub/watt/date';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { AddTokenToDownloadUrlDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhSettlementReport } from '@energinet-datahub/dh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class DhSettlementReportsService {
  private toastService = inject(WattToastService);

  private addTokenToDownloadUrlMutation = mutation(AddTokenToDownloadUrlDocument);

  async downloadReport(settlementReport: DhSettlementReport) {
    let { settlementReportDownloadUrl } = settlementReport;

    if (!settlementReportDownloadUrl) {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });

      return;
    }

    settlementReportDownloadUrl = `${settlementReportDownloadUrl}&filename=${this.settlementReportName(settlementReport)}`;

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

  private settlementReportName(report: DhSettlementReport): string {
    const baseTranslationPath = 'wholesale.settlementReports';

    const calculationPeriod = wattFormatDate(report.period, 'short');
    const calculationType = translate(
      `${baseTranslationPath}.calculationTypes.${report.calculationType}`
    );

    let name = translate(`${baseTranslationPath}.downloadReport.baseName`);
    name += ` - ${calculationType}`;

    if (report.gridAreas.length === 1) {
      name += ` - ` + report.gridAreas[0];
    } else if (report.gridAreas.length > 1) {
      name += ` - ` + translate(`${baseTranslationPath}.downloadReport.multipleGridAreas`);
    }

    return `${name} - ${calculationPeriod}.zip`;
  }
}
