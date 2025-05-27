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
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { translate } from '@jsverse/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { AddTokenToDownloadUrlDocument } from '@energinet-datahub/dh/shared/domain/graphql';

type DownloadReportParams = {
  injector: Injector;
  downloadUrl: string | undefined | null;
  fileName: string;
};

export function dhDownloadReport({ injector, downloadUrl, fileName }: DownloadReportParams) {
  return runInInjectionContext(injector, async () => {
    const addTokenToDownloadUrlMutation = mutation(AddTokenToDownloadUrlDocument);
    const toastService = inject(WattToastService);

    if (!downloadUrl) {
      toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });

      return;
    }

    downloadUrl = `${downloadUrl}&filename=${fileName}`;

    const result = await addTokenToDownloadUrlMutation.mutate({
      variables: { url: downloadUrl },
    });

    const downloadUrlWithToken = result.data?.addTokenToDownloadUrl.downloadUrlWithToken;

    if (downloadUrlWithToken) {
      const link = document.createElement('a');
      link.href = downloadUrlWithToken;
      link.target = '_blank';
      link.click();
      link.remove();
    }
  });
}
