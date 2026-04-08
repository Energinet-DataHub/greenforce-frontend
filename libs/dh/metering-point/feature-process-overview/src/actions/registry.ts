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
import { toSignal } from '@angular/core/rxjs-interop';

import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  EicFunction,
  ProcessManagerBusinessReason,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { ProcessActionContext } from './context';
import { EndOfSupplyActions } from './end-of-supply/end-of-supply';
import { CustomerMoveInActions } from './customer-move-in/customer-move-in';

export interface ActionHandler {
  featureFlag?: Parameters<DhFeatureFlagsService['isEnabled']>[0];
  marketRoles?: EicFunction[];
  callback: (context: ProcessActionContext) => void;
}

export type ActionHandlerMap = Partial<Record<WorkflowAction, ActionHandler>>;

@Injectable({ providedIn: 'root' })
export class DhActionsRegistry {
  private readonly featureFlags = inject(DhFeatureFlagsService);
  private readonly permissionService = inject(PermissionService);

  private readonly isGridAccessProvider = toSignal(
    this.permissionService.hasMarketRole(EicFunction.GridAccessProvider),
    { initialValue: false }
  );

  private readonly isEnergySupplier = toSignal(
    this.permissionService.hasMarketRole(EicFunction.EnergySupplier),
    { initialValue: false }
  );

  private readonly registry: Partial<Record<ProcessManagerBusinessReason, ActionHandlerMap>> = {
    [ProcessManagerBusinessReason.EndOfSupply]: inject(EndOfSupplyActions).handlers,
    [ProcessManagerBusinessReason.CustomerMoveIn]: inject(CustomerMoveInActions).handlers,
  };

  private hasRequiredMarketRole(handler: ActionHandler): boolean {
    if (!handler.marketRoles?.length) return true;
    return handler.marketRoles.some((role) => {
      if (role === EicFunction.GridAccessProvider) return this.isGridAccessProvider();
      if (role === EicFunction.EnergySupplier) return this.isEnergySupplier();
      console.error('[DhActionsRegistry] Unsupported market role:', role);
      return false;
    });
  }

  getSupportedActions(
    availableActions: WorkflowAction[],
    businessReason: ProcessManagerBusinessReason
  ): WorkflowAction[] {
    return availableActions.filter((action) => {
      const handler = this.registry[businessReason]?.[action];
      return (
        handler &&
        this.featureFlags.isEnabled(handler.featureFlag) &&
        this.hasRequiredMarketRole(handler)
      );
    });
  }

  execute(
    action: WorkflowAction,
    businessReason: ProcessManagerBusinessReason,
    context: ProcessActionContext
  ): void {
    const handler = this.registry[businessReason]?.[action];
    if (
      handler &&
      this.featureFlags.isEnabled(handler.featureFlag) &&
      this.hasRequiredMarketRole(handler)
    ) {
      handler.callback(context);
    }
  }
}
