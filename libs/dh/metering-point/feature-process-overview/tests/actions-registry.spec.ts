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
import { vi } from 'vitest';
import { of } from 'rxjs';

import {
  EicFunction,
  ProcessManagerBusinessReason,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';
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
      isGridAccessProvider?: boolean;
      endOfSupplyHandlers?: ActionHandlerMap;
      customerMoveInHandlers?: ActionHandlerMap;
    } = {}
  ) {
    const {
      featureFlagsEnabled = true,
      isGridAccessProvider = true,
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
            hasMarketRole: (role: EicFunction) =>
              of(role === EicFunction.GridAccessProvider ? isGridAccessProvider : false),
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

    it('should return action when user has required market role', () => {
      const registry = setupRegistry({
        isGridAccessProvider: true,
        endOfSupplyHandlers: {
          [WorkflowAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            marketRoles: [EicFunction.GridAccessProvider],
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

    it('should filter out action when user lacks required market role', () => {
      const registry = setupRegistry({
        isGridAccessProvider: false,
        endOfSupplyHandlers: {
          [WorkflowAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            marketRoles: [EicFunction.GridAccessProvider],
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

    it('should allow action without marketRoles regardless of user role', () => {
      const registry = setupRegistry({
        isGridAccessProvider: false,
      });

      const result = registry.getSupportedActions(
        [WorkflowAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([WorkflowAction.CancelWorkflow]);
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

    it('should not call handler when user lacks required market role', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        isGridAccessProvider: false,
        endOfSupplyHandlers: {
          [WorkflowAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            marketRoles: [EicFunction.GridAccessProvider],
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
