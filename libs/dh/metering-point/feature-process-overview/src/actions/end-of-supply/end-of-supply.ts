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

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  EicFunction,
  ProcessManagerBusinessReason,
  CancelEndOfSupplyDocument,
  DisconnectMeteringPointDocument,
  RejectEndOfSupplyDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
  MeteringPointProcessAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { ResponsibleEnergySupplier, type ActionHandlerMap } from '../registry';
import { cancelProcessAction } from '../shared/cancel-process-action';
import { disconnectProcessAction } from '../shared/disconnect-process-action';
import { rejectProcessAction } from '../shared/reject-process-action';
import { DhRequestServiceModal } from '../../components/request-service-modal';

@Injectable({ providedIn: 'root' })
export class EndOfSupplyActions {
  private readonly modalService = inject(WattModalService);
  private readonly cancelEndOfSupply = mutation(CancelEndOfSupplyDocument);
  private readonly disconnectMeteringPoint = mutation(DisconnectMeteringPointDocument);
  private readonly rejectEndOfSupply = mutation(RejectEndOfSupplyDocument);

  readonly handlers: ActionHandlerMap = {
    [MeteringPointProcessAction.SendInformation]: {
      releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
      permissions: ['metering-point:end-of-supply-request'],
      roles: [ResponsibleEnergySupplier],
      callback: (ctx) => {
        this.modalService.open({
          component: DhRequestServiceModal,
          data: {
            meteringPointId: ctx.meteringPointId,
            processId: ctx.processId,
          },
          onClosed: (result) => {
            if (result) ctx.onSuccess?.();
          },
        });
      },
    },
    [MeteringPointProcessAction.ConfirmWorkflow]: {
      releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
      permissions: ['metering-point:connection-state-manage'],
      roles: [EicFunction.GridAccessProvider],
      callback: disconnectProcessAction((ctx, result, onCompleted, onError) => {
        this.disconnectMeteringPoint.mutate({
          refetchQueries: [
            GetMeteringPointProcessByIdDocument,
            GetMeteringPointProcessOverviewDocument,
          ],
          variables: {
            meteringPointId: ctx.meteringPointId,
            processId: ctx.processId,
            validityDate: result.validityDate,
            currentConnectionState: ctx.connectionState,
          },
          onCompleted,
          onError,
        });
      }),
    },
    [MeteringPointProcessAction.RejectRequest]: {
      releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
      permissions: ['metering-point:end-of-supply-respond'],
      roles: [EicFunction.GridAccessProvider],
      callback: rejectProcessAction(({ ctx, result, onCompleted, onError }) => {
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
    [MeteringPointProcessAction.CancelWorkflow]: {
      releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
      permissions: ['metering-point:end-of-supply-request'],
      roles: [ResponsibleEnergySupplier],
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
