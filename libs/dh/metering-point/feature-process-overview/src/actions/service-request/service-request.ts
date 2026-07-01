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
  CancelServiceRequestDocument,
  RejectServiceRequestDocument,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
  MeteringPointProcessAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { ResponsibleEnergySupplier, type ActionHandlerMap } from '../registry';
import { cancelProcessAction } from '../shared/cancel-process-action';
import { rejectProcessAction } from '../shared/reject-process-action';
import { DhConfirmServiceRequestModal } from '../../components/dh-confirm-service-request-modal';

@Injectable({ providedIn: 'root' })
export class ServiceRequestActions {
  private readonly modalService = inject(WattModalService);
  private readonly cancelServiceRequest = mutation(CancelServiceRequestDocument);
  private readonly rejectServiceRequest = mutation(RejectServiceRequestDocument);

  readonly handlers: ActionHandlerMap = {
    [MeteringPointProcessAction.ConfirmWorkflow]: {
      releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
      permissions: ['metering-point:service-request-respond'],
      roles: [EicFunction.GridAccessProvider],
      callback: (ctx) => {
        if (!ctx.cutoffDate) return;
        this.modalService.open({
          component: DhConfirmServiceRequestModal,
          data: {
            meteringPointId: ctx.meteringPointId,
            processId: ctx.processId,
            startDate: ctx.cutoffDate,
          },
          onClosed: (result) => {
            if (result) ctx.onSuccess?.();
          },
        });
      },
    },
    [MeteringPointProcessAction.RejectRequest]: {
      releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
      permissions: ['metering-point:service-request-respond'],
      roles: [EicFunction.GridAccessProvider],
      callback: rejectProcessAction(
        ({ ctx, result, onCompleted, onError }) => {
          this.rejectServiceRequest.mutate({
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
        },
        {
          titleKey: 'meteringPoint.processOverview.rejectServiceRequest.title',
          successToastKey: 'meteringPoint.processOverview.rejectServiceRequest.successToast',
          errorToastKey: 'meteringPoint.processOverview.rejectServiceRequest.errorToast',
        }
      ),
    },
    [MeteringPointProcessAction.CancelWorkflow]: {
      releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
      permissions: ['metering-point:service-request-request'],
      roles: [ResponsibleEnergySupplier],
      callback: cancelProcessAction(
        `meteringPoint.processOverview.processTypeName.${ProcessManagerBusinessReason.ServiceRequest}`,
        (ctx, onCompleted, onError) => {
          this.cancelServiceRequest.mutate({
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
        },
        {
          confirmLabelKey: 'meteringPoint.processOverview.cancelServiceRequest.confirm',
          successToastKey: 'meteringPoint.processOverview.cancelServiceRequest.successToast',
        }
      ),
    },
  };
}
