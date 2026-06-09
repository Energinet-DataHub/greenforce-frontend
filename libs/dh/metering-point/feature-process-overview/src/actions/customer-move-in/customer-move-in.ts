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
import { Router } from '@angular/router';

import { WattModalService } from '@energinet/watt/modal';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  CancelCustomerMoveInDocument,
  ChangeCustomerCharacteristicsBusinessReason,
  EicFunction,
  GetMeteringPointProcessByIdDocument,
  GetMeteringPointProcessOverviewDocument,
  MeteringPointProcessAction,
  ProcessManagerBusinessReason,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  BasePaths,
  getPath,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';

import {
  InitiatingParticipant,
  ResponsibleEnergySupplier,
  type ActionHandlerMap,
} from '../registry';
import { cancelProcessAction } from '../shared/cancel-process-action';
import { DhRequestIncorrectMoveInModal } from '../../components/request-incorrect-move-in-modal';

@Injectable({ providedIn: 'root' })
export class CustomerMoveInActions {
  private readonly router = inject(Router);
  private readonly modalService = inject(WattModalService);
  private readonly cancelCustomerMoveIn = mutation(CancelCustomerMoveInDocument);

  readonly handlers: ActionHandlerMap = {
    [MeteringPointProcessAction.SendInformation]: {
      roles: [InitiatingParticipant, EicFunction.GridAccessProvider],
      callback: (ctx) =>
        this.router.navigate(
          [
            getPath<BasePaths>('metering-point'),
            ctx.internalMeteringPointId,
            getPath<MeteringPointSubPaths>('update-customer-details'),
            ctx.processId,
          ],
          {
            queryParams: {
              businessReason: ChangeCustomerCharacteristicsBusinessReason.CustomerMoveIn,
            },
          }
        ),
    },
    [MeteringPointProcessAction.CancelWorkflow]: {
      permissions: ['metering-point:move-in'],
      roles: [InitiatingParticipant],
      callback: cancelProcessAction(
        `meteringPoint.processOverview.processTypeName.${ProcessManagerBusinessReason.CustomerMoveIn}`,
        (ctx, onCompleted, onError) => {
          this.cancelCustomerMoveIn.mutate({
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
    [MeteringPointProcessAction.InitiateIncorrectMoveIn]: {
      releaseToggle: 'BRS011-INCOMING-MESSAGES',
      permissions: ['metering-point:move-in'],
      roles: [ResponsibleEnergySupplier],
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
