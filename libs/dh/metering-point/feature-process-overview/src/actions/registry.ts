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
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { Permission } from '@energinet-datahub/dh/shared/domain';
import {
  EicFunction,
  ProcessManagerBusinessReason,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { ProcessActionContext } from './context';
import { EndOfSupplyActions } from './end-of-supply/end-of-supply';
import { CustomerMoveInActions } from './customer-move-in/customer-move-in';
import { ChangeOfEnergySupplierActions } from './change-of-energy-supplier/change-of-energy-supplier';

export const ResponsibleEnergySupplier = 'ResponsibleEnergySupplier' as const;
export const InitiatingParticipant = 'InitiatingParticipant' as const;
export type ActionRole =
  | EicFunction
  | typeof ResponsibleEnergySupplier
  | typeof InitiatingParticipant;

export interface ActionHandler {
  featureFlag?: Parameters<DhFeatureFlagsService['isEnabled']>[0];
  permissions?: Permission[];
  roles?: ActionRole[];
  callback: (context: ProcessActionContext) => void;
}

export type ActionHandlerMap = Partial<Record<WorkflowAction, ActionHandler>>;

function collectPermissions(
  registry: Partial<Record<ProcessManagerBusinessReason, ActionHandlerMap>>
): Set<Permission> {
  const permissions = new Set<Permission>();
  for (const handlers of Object.values(registry)) {
    for (const handler of Object.values(handlers ?? {})) {
      handler?.permissions?.forEach((permission) => permissions.add(permission));
    }
  }
  return permissions;
}

@Injectable({ providedIn: 'root' })
export class DhActionsRegistry {
  private readonly featureFlags = inject(DhFeatureFlagsService);
  private readonly permissionService = inject(PermissionService);
  private readonly actorStorage = inject(DhActorStorage);

  private readonly isFas = toSignal(this.permissionService.isFas(), { initialValue: false });

  private readonly registry: Partial<Record<ProcessManagerBusinessReason, ActionHandlerMap>> = {
    [ProcessManagerBusinessReason.EndOfSupply]: inject(EndOfSupplyActions).handlers,
    [ProcessManagerBusinessReason.CustomerMoveIn]: inject(CustomerMoveInActions).handlers,
    [ProcessManagerBusinessReason.ChangeOfEnergySupplier]: inject(ChangeOfEnergySupplierActions)
      .handlers,
  };

  private readonly permissionSignals: ReadonlyMap<Permission, Signal<boolean>> = new Map(
    [...collectPermissions(this.registry)].map((permission) => [
      permission,
      toSignal(this.permissionService.hasPermission(permission), { initialValue: false }),
    ])
  );

  private hasRequiredPermission(handler: ActionHandler): boolean {
    if (!handler.permissions?.length) return true;
    return handler.permissions.some(
      (permission) => this.permissionSignals.get(permission)?.() ?? false
    );
  }

  private matchesRoles(
    handler: ActionHandler,
    isResponsible: boolean,
    initiatorGlnOrEic?: string
  ): boolean {
    if (!handler.roles?.length) return true;
    const actor = this.actorStorage.getSelectedActor();
    return handler.roles.some((role) => {
      if (role === ResponsibleEnergySupplier) return isResponsible;
      // actor.gln can hold either a GLN or EIC (mirrors GraphQL glnOrEicNumber);
      // initiatorGlnOrEic is sourced from the same field, so the comparison is semantically correct
      if (role === InitiatingParticipant)
        return !!initiatorGlnOrEic && actor.gln === initiatorGlnOrEic;
      return actor.marketRole === role;
    });
  }

  getSupportedActions(
    availableActions: WorkflowAction[],
    businessReason: ProcessManagerBusinessReason,
    isEnergySupplierResponsible: boolean,
    initiatorGlnOrEic?: string
  ): WorkflowAction[] {
    return availableActions.filter((action) => {
      const handler = this.registry[businessReason]?.[action];
      if (!handler || !this.featureFlags.isEnabled(handler.featureFlag)) return false;
      // FAS users see every supported action (info row in the table, disabled
      // button in the drawer). Execution is blocked separately in execute().
      if (this.isFas()) return true;
      if (!this.hasRequiredPermission(handler)) return false;
      return this.matchesRoles(handler, isEnergySupplierResponsible, initiatorGlnOrEic);
    });
  }

  execute(
    action: WorkflowAction,
    businessReason: ProcessManagerBusinessReason,
    context: ProcessActionContext,
    isEnergySupplierResponsible: boolean,
    initiatorGlnOrEic?: string
  ): void {
    if (this.isFas()) return;
    const supported = this.getSupportedActions(
      [action],
      businessReason,
      isEnergySupplierResponsible,
      initiatorGlnOrEic
    );
    if (!supported.includes(action)) return;
    this.registry[businessReason]?.[action]?.callback(context);
  }
}
