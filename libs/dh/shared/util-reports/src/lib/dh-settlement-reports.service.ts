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
import { computed, inject, Injectable, Injector } from '@angular/core';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetSettlementReportDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhSettlementReportPartial } from './dh-settlement-report-partial';
import { dhSettlementReportName } from './dh-settlement-report-name';
import { dhDownloadReport } from './dh-download-report';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { wattFormatDate } from '@energinet-datahub/watt/date';
import { translate } from '@jsverse/transloco';

@Injectable()
export class DhSettlementReportsService {
  private env = inject(dhAppEnvironmentToken);
  private injector = inject(Injector);

  private settlementReportQuery = lazyQuery(GetSettlementReportDocument);

  public settlementReportNameInNotification = computed(() => {
    const settlementReport = this.settlementReportQuery.data()?.settlementReportById;

    if (!settlementReport) {
      return '—';
    }

    return dhSettlementReportName(settlementReport, { withBaseName: false });
  });

  getSettlementReportName(settlementReportId: string) {
    this.getSettlementReport(settlementReportId);
  }

  async downloadReportFromNotification(settlementReportId: string) {
    const result = await this.getSettlementReport(settlementReportId);

    if (result.data.settlementReportById) {
      this.downloadReport(result.data.settlementReportById);
    }
  }

  downloadReport(settlementReport: DhSettlementReportPartial) {
    const date = wattFormatDate(new Date(), 'long');
    const env = translate(`environmentName.${this.env.current}`);
    const fileName = `${dhSettlementReportName(settlementReport)} ${env} ${date}.zip`;

    dhDownloadReport({
      injector: this.injector,
      downloadUrl: settlementReport.settlementReportDownloadUrl,
      fileName,
    });
  }

  private getSettlementReport(id: string) {
    return this.settlementReportQuery.query({
      variables: { id },
    });
  }
}
