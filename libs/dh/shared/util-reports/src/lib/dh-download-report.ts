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
