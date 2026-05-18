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

import { WattToastService } from '@energinet/watt/toast';

import { RequestReallocateChangeOfSupplierDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { translate } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class RequestReallocateChangeOfSupplier {
  private readonly toastService = inject(WattToastService);
  private readonly requestReallocateChangeOfSupplier = mutation(
    RequestReallocateChangeOfSupplierDocument
  );

  request(processId: string, meteringPointId: string, cutoffDate: Date) {
    this.requestReallocateChangeOfSupplier.mutate({
      variables: {
        processId,
        meteringPointId,
        cutoffDate,
      },
      onCompleted: (result) => {
        if (result.requestReallocateChangeOfSupplier.success) {
          this.toastService.open({
            type: 'success',
            message: translate(
              'meteringPoint.processOverview.reallocateChangeOfSupplier.successToast'
            ),
          });
        } else {
          this.onError();
        }
      },
      onError: () => this.onError(),
    });
  }

  private onError() {
    this.toastService.open({
      type: 'danger',
      message: translate('meteringPoint.processOverview.reallocateChangeOfSupplier.errorToast'),
    });
  }
}
