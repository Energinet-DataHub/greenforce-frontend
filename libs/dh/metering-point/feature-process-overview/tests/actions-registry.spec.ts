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
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import {
  ProcessManagerBusinessReason,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { Permission } from '@energinet-datahub/dh/shared/domain';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhActionsRegistry, ActionHandlerMap } from '../src/actions/registry';
import { EndOfSupplyActions } from '../src/actions/end-of-supply/end-of-supply';
import { CustomerMoveInActions } from '../src/actions/customer-move-in/customer-move-in';
import { ProcessActionContext } from '../src/actions/context';

// -- Test helpers --

const mockContext: ProcessActionContext = {
  meteringPointId: 'mp-1',
  internalMeteringPointId: 'imp-1',
  processId: 'process-1',
};

function createMockHandlers(handlers: ActionHandlerMap) {
  return { handlers };
}

// -- DhActionsRegistry unit tests --

describe('DhActionsRegistry', () => {
  beforeEach(() => TestBed.resetTestingModule());

  function setupRegistry(
    options: {
      featureFlagsEnabled?: boolean;
      hasEndOfSupplyRespondPermission?: boolean;
      hasEndOfSupplyRequestPermission?: boolean;
      isFas?: boolean;
      endOfSupplyHandlers?: ActionHandlerMap;
      customerMoveInHandlers?: ActionHandlerMap;
    } = {}
  ) {
    const {
      featureFlagsEnabled = true,
      hasEndOfSupplyRespondPermission = true,
      hasEndOfSupplyRequestPermission = false,
      isFas = false,
      endOfSupplyHandlers = {
        [WorkflowAction.CancelWorkflow]: {
          featureFlag: 'end-of-supply',
          callback: vi.fn(),
        },
      },
      customerMoveInHandlers = {
        [WorkflowAction.SendInformation]: {
          callback: vi.fn(),
        },
      },
    } = options;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: DhFeatureFlagsService,
          useValue: { isEnabled: () => featureFlagsEnabled },
        },
        {
          provide: PermissionService,
          useValue: {
            hasPermission: (permission: Permission) => {
              if (permission === 'metering-point:end-of-supply-respond')
                return of(hasEndOfSupplyRespondPermission);
              if (permission === 'metering-point:end-of-supply-request')
                return of(hasEndOfSupplyRequestPermission);
              return of(false);
            },
            isFas: () => of(isFas),
          },
        },
        {
          provide: EndOfSupplyActions,
          useValue: createMockHandlers(endOfSupplyHandlers),
        },
        {
          provide: CustomerMoveInActions,
          useValue: createMockHandlers(customerMoveInHandlers),
        },
      ],
    });

    return TestBed.inject(DhActionsRegistry);
  }

  describe('getSupportedActions', () => {
    it('should return CancelWorkflow for EndOfSupply when feature flag is enabled', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [WorkflowAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([WorkflowAction.CancelWorkflow]);
    });

    it('should return SendInformation for CustomerMoveIn (no feature flag required)', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [WorkflowAction.SendInformation],
        ProcessManagerBusinessReason.CustomerMoveIn
      );

      expect(result).toEqual([WorkflowAction.SendInformation]);
    });

    it('should filter out actions not registered for the business reason', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [WorkflowAction.CancelWorkflow, WorkflowAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([WorkflowAction.CancelWorkflow]);
    });

    it('should return empty array when feature flag is disabled', () => {
      const registry = setupRegistry({ featureFlagsEnabled: false });

      const result = registry.getSupportedActions(
        [WorkflowAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([]);
    });

    it('should return empty array for unregistered business reason', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [WorkflowAction.CancelWorkflow],
        ProcessManagerBusinessReason.NewMeteringPoint
      );

      expect(result).toEqual([]);
    });

    it('should return empty array when no available actions', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions([], ProcessManagerBusinessReason.EndOfSupply);

      expect(result).toEqual([]);
    });

    it('should return action when user has required permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: true,
        endOfSupplyHandlers: {
          [WorkflowAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            permissions: ['metering-point:end-of-supply-respond'],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [WorkflowAction.RejectRequest],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([WorkflowAction.RejectRequest]);
    });

    it('should filter out action when user lacks required permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        endOfSupplyHandlers: {
          [WorkflowAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            permissions: ['metering-point:end-of-supply-respond'],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [WorkflowAction.RejectRequest],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([]);
    });

    it('should allow action without permissions regardless of user permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
      });

      const result = registry.getSupportedActions(
        [WorkflowAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([WorkflowAction.CancelWorkflow]);
    });

    it('should return action when user has end-of-supply permission and action allows it', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        hasEndOfSupplyRequestPermission: true,
        endOfSupplyHandlers: {
          [WorkflowAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            permissions: [
              'metering-point:end-of-supply-request',
              'metering-point:end-of-supply-respond',
            ],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [WorkflowAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([WorkflowAction.SendInformation]);
    });

    it('should return action when user has end-of-supply-respond permission and action allows both', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: true,
        hasEndOfSupplyRequestPermission: false,
        endOfSupplyHandlers: {
          [WorkflowAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            permissions: [
              'metering-point:end-of-supply-request',
              'metering-point:end-of-supply-respond',
            ],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [WorkflowAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([WorkflowAction.SendInformation]);
    });

    it('should filter out action when user has neither required permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        hasEndOfSupplyRequestPermission: false,
        endOfSupplyHandlers: {
          [WorkflowAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            permissions: [
              'metering-point:end-of-supply-request',
              'metering-point:end-of-supply-respond',
            ],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [WorkflowAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([]);
    });
  });

  describe('execute', () => {
    it('should call the correct handler callback', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [WorkflowAction.CancelWorkflow]: { callback },
        },
      });

      registry.execute(
        WorkflowAction.CancelWorkflow,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext
      );

      expect(callback).toHaveBeenCalledWith(mockContext);
    });

    it('should not throw for unregistered business reason', () => {
      const registry = setupRegistry();

      expect(() =>
        registry.execute(
          WorkflowAction.CancelWorkflow,
          ProcessManagerBusinessReason.NewMeteringPoint,
          mockContext
        )
      ).not.toThrow();
    });

    it('should not throw for unregistered action', () => {
      const registry = setupRegistry();

      expect(() =>
        registry.execute(
          WorkflowAction.SendInformation,
          ProcessManagerBusinessReason.EndOfSupply,
          mockContext
        )
      ).not.toThrow();
    });

    it('should not call handler when user lacks required permission', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        endOfSupplyHandlers: {
          [WorkflowAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            permissions: ['metering-point:end-of-supply-respond'],
            callback,
          },
        },
      });

      registry.execute(
        WorkflowAction.RejectRequest,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext
      );

      expect(callback).not.toHaveBeenCalled();
    });

    it('should pass onSuccess callback through context', () => {
      const callback = vi.fn();
      const onSuccess = vi.fn();
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [WorkflowAction.CancelWorkflow]: { callback },
        },
      });

      registry.execute(WorkflowAction.CancelWorkflow, ProcessManagerBusinessReason.EndOfSupply, {
        ...mockContext,
        onSuccess,
      });

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ onSuccess }));
    });
  });
});
