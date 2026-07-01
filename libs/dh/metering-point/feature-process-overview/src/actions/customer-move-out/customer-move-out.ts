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

import { WattModalService } from '@energinet/watt/modal';

import { MeteringPointProcessAction } from '@energinet-datahub/dh/shared/domain/graphql';

import { InitiatingParticipant, type ActionHandlerMap } from '../registry';
import { DhRequestIncorrectMoveInModal } from '../../components/request-incorrect-move-in-modal';

@Injectable({ providedIn: 'root' })
export class CustomerMoveOutActions {
  private readonly modalService = inject(WattModalService);

  readonly handlers: ActionHandlerMap = {
    [MeteringPointProcessAction.InitiateIncorrectMoveOut]: {
      permissions: ['metering-point:move-in'],
      roles: [InitiatingParticipant],
      callback: (ctx) => {
        if (!ctx.cutoffDate) return;
        this.modalService.open({
          component: DhRequestIncorrectMoveInModal,
          data: {
            meteringPointId: ctx.meteringPointId,
            processId: ctx.processId,
            cutoffDate: ctx.cutoffDate,
          },
        });
      },
    },
  };
}
