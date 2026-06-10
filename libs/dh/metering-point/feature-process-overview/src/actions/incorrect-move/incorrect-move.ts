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
import { Injectable } from '@angular/core';

import { injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  EicFunction,
  AcceptIncorrectMoveDocument,
  RejectIncorrectMoveDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { type ActionHandlerMap } from '../registry';
import { confirmAction } from '../shared/confirm-action';

@Injectable({ providedIn: 'root' })
export class IncorrectMoveActions {
  private readonly acceptIncorrectMove = mutation(AcceptIncorrectMoveDocument, {
    onStatusUpdated: injectToast('meteringPoint.processOverview.acceptIncorrectMove.toast'),
    refetchQueries: [GetMeteringPointProcessByIdDocument, GetMeteringPointProcessOverviewDocument],
  });

  private readonly rejectIncorrectMove = mutation(RejectIncorrectMoveDocument, {
    onStatusUpdated: injectToast('meteringPoint.processOverview.rejectIncorrectMove.toast'),
    refetchQueries: [GetMeteringPointProcessByIdDocument, GetMeteringPointProcessOverviewDocument],
  });

  readonly handlers: ActionHandlerMap = {
    [WorkflowAction.ConfirmWorkflow]: {
      permissions: ['metering-point:move-in'],
      roles: [EicFunction.EnergySupplier],
      callback: confirmAction({
        translationKey: 'meteringPoint.processOverview.acceptIncorrectMove.confirm',
        onConfirm: (ctx) => {
          this.acceptIncorrectMove.mutate({
            variables: {
              meteringPointId: ctx.meteringPointId,
              processId: ctx.processId,
            },
          });
        },
      }),
    },
    [WorkflowAction.RejectRequest]: {
      permissions: ['metering-point:move-in'],
      roles: [EicFunction.EnergySupplier],
      callback: confirmAction({
        translationKey: 'meteringPoint.processOverview.rejectIncorrectMove.confirm',
        onConfirm: (ctx) => {
          this.rejectIncorrectMove.mutate({
            variables: {
              meteringPointId: ctx.meteringPointId,
              processId: ctx.processId,
            },
          });
        },
      }),
    },
  };
}
