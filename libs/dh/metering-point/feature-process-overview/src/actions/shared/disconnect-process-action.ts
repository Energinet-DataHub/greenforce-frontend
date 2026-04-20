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
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { WattModalService } from '@energinet/watt/modal';
import { WattToastService } from '@energinet/watt/toast';

import {
  DhDisconnectMeteringPointModal,
  DisconnectMeteringPointResult,
} from '../../components/disconnect-metering-point-modal';
import { ProcessActionContext } from '../context';

/**
 * Creates a disconnect process action callback. Must be called within an Angular injection context
 * (e.g. a field initializer of an @Injectable class).
 */
export function disconnectProcessAction(
  executeMutation: (
    ctx: ProcessActionContext,
    result: DisconnectMeteringPointResult,
    onCompleted: () => void,
    onError: () => void
  ) => void
): (ctx: ProcessActionContext) => void {
  const modalService = inject(WattModalService);
  const transloco = inject(TranslocoService);
  const toast = inject(WattToastService);

  return (ctx) => {
    modalService.open({
      component: DhDisconnectMeteringPointModal,
      onClosed: (result: DisconnectMeteringPointResult | undefined) => {
        if (!result) return;
        executeMutation(
          ctx,
          result,
          () => {
            toast.open({
              type: 'success',
              message: transloco.translate(
                'meteringPoint.processOverview.disconnectProcess.successToast'
              ),
            });
            ctx.onSuccess?.();
          },
          () => {
            toast.open({
              type: 'danger',
              message: transloco.translate(
                'meteringPoint.processOverview.disconnectProcess.errorToast'
              ),
            });
          }
        );
      },
    });
  };
}
