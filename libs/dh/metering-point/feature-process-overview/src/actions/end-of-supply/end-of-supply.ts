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

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  EicFunction,
  ProcessManagerBusinessReason,
  CancelEndOfSupplyDocument,
  RejectEndOfSupplyDocument,
  RequestServiceEndOfSupplyDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import type { ActionHandlerMap } from '../registry';
import { cancelProcessAction } from '../shared/cancel-process-action';
import { rejectProcessAction } from '../shared/reject-process-action';
import { requestServiceAction } from '../shared/request-service-action';

@Injectable({ providedIn: 'root' })
export class EndOfSupplyActions {
  private readonly cancelEndOfSupply = mutation(CancelEndOfSupplyDocument);
  private readonly rejectEndOfSupply = mutation(RejectEndOfSupplyDocument);
  private readonly requestServiceEndOfSupply = mutation(RequestServiceEndOfSupplyDocument);

  readonly handlers: ActionHandlerMap = {
    [WorkflowAction.RequestService]: {
      featureFlag: 'end-of-supply',
      marketRoles: [EicFunction.EnergySupplier, EicFunction.GridAccessProvider],
      callback: requestServiceAction((ctx, result, onCompleted, onError) => {
        this.requestServiceEndOfSupply.mutate({
          refetchQueries: [
            GetMeteringPointProcessByIdDocument,
            GetMeteringPointProcessOverviewDocument,
          ],
          variables: {
            meteringPointId: ctx.meteringPointId,
            processId: ctx.processId,
            serviceKind: result.serviceKind,
            startDate: result.startDate.toISOString(),
            description: result.description,
          },
          onCompleted,
          onError,
        });
      }),
    },
    [WorkflowAction.RejectRequest]: {
      featureFlag: 'end-of-supply',
      marketRoles: [EicFunction.GridAccessProvider],
      callback: rejectProcessAction((ctx, result, onCompleted, onError) => {
        this.rejectEndOfSupply.mutate({
          refetchQueries: [
            GetMeteringPointProcessByIdDocument,
            GetMeteringPointProcessOverviewDocument,
          ],
          variables: {
            meteringPointId: ctx.meteringPointId,
            processId: ctx.processId,
            reasonCode: result.reasonCode,
            reasonMessage: result.reasonMessage,
            description: result.description,
          },
          onCompleted,
          onError,
        });
      }),
    },
    [WorkflowAction.CancelWorkflow]: {
      featureFlag: 'end-of-supply',
      callback: cancelProcessAction(
        `meteringPoint.processOverview.processTypeName.${ProcessManagerBusinessReason.EndOfSupply}`,
        (ctx, onCompleted, onError) => {
          this.cancelEndOfSupply.mutate({
            refetchQueries: [
              GetMeteringPointProcessByIdDocument,
              GetMeteringPointProcessOverviewDocument,
            ],
            variables: {
              meteringPointId: ctx.meteringPointId,
              processId: ctx.processId,
            },
            onCompleted,
            onError,
          });
        }
      ),
    },
  };
}
