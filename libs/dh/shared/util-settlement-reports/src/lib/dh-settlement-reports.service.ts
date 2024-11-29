import { computed, inject, Injectable } from '@angular/core';
import { translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  AddTokenToDownloadUrlDocument,
  GetSettlementReportDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhSettlementReportPartial } from './dh-settlement-report-partial';
import { dhSettlementReportName } from './dh-settlement-report-name';

@Injectable()
export class DhSettlementReportsService {
  private toastService = inject(WattToastService);

  private addTokenToDownloadUrlMutation = mutation(AddTokenToDownloadUrlDocument);
  private settlementReportQuery = lazyQuery(GetSettlementReportDocument);

  public settlementReportNameInNotification = computed(() => {
    const settlementReport = this.settlementReportQuery.data()?.settlementReport;

    if (settlementReport === undefined) {
      return '—';
    }

    return dhSettlementReportName(settlementReport, { withBaseName: false });
  });

  getSettlementReportName(settlementReportId: string) {
    this.getSettlementReport(settlementReportId);
  }

  async downloadReportFromNotification(settlementReportId: string) {
    const result = await this.getSettlementReport(settlementReportId);

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

    const fileName = `${dhSettlementReportName(settlementReport)}.zip`;

    settlementReportDownloadUrl = `${settlementReportDownloadUrl}&filename=${fileName}`;

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

  private getSettlementReport(settlementReportId: string) {
    return this.settlementReportQuery.query({
      variables: {
        value: { id: settlementReportId },
      },
    });
  }
}
