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
import { inject, Injectable } from '@angular/core';
import { translate } from '@jsverse/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { AddTokenToDownloadUrlDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhMeasurementsReportPartial } from './dh-measurements-report-partial';
import { dhMeasurementsReportName } from './dh-measurements-report-name';

@Injectable()
export class DhMeasurementsReportsService {
  private toastService = inject(WattToastService);

  private addTokenToDownloadUrlMutation = mutation(AddTokenToDownloadUrlDocument);

  async downloadReport(measurementsReport: DhMeasurementsReportPartial) {
    let { measurementsReportDownloadUrl } = measurementsReport;

    if (!measurementsReportDownloadUrl) {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });

      return;
    }

    const fileName = `${dhMeasurementsReportName(measurementsReport)}.zip`;

    measurementsReportDownloadUrl = `${measurementsReportDownloadUrl}&filename=${fileName}`;

    const result = await this.addTokenToDownloadUrlMutation.mutate({
      variables: { url: measurementsReportDownloadUrl },
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
