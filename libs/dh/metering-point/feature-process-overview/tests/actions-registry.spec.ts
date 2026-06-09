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
  EicFunction,
  MeteringPointProcessAction,
  ProcessManagerBusinessReason,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { Permission } from '@energinet-datahub/dh/shared/domain';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { DhReleaseToggleService } from '@energinet-datahub/dh/shared/util-release-toggle';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import {
  DhActionsRegistry,
  ActionHandlerMap,
  ResponsibleEnergySupplier,
  InitiatingParticipant,
} from '../src/actions/registry';
import { EndOfSupplyActions } from '../src/actions/end-of-supply/end-of-supply';
import { CustomerMoveInActions } from '../src/actions/customer-move-in/customer-move-in';
import { SecondaryMoveInActions } from '../src/actions/customer-move-in/secondary-move-in';
import { ChangeOfEnergySupplierActions } from '../src/actions/change-of-energy-supplier/change-of-energy-supplier';
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
      releaseTogglesEnabled?: boolean;
      featureFlagsEnabled?: boolean;
      hasEndOfSupplyRespondPermission?: boolean;
      hasEndOfSupplyRequestPermission?: boolean;
      hasMoveInPermission?: boolean;
      hasChangeOfSupplierPermission?: boolean;
      isFas?: boolean;
      actorMarketRole?: EicFunction;
      endOfSupplyHandlers?: ActionHandlerMap;
      customerMoveInHandlers?: ActionHandlerMap;
      secondaryMoveInHandlers?: ActionHandlerMap;
      changeOfEnergySupplierHandlers?: ActionHandlerMap;
    } = {}
  ) {
    const {
      releaseTogglesEnabled = true,
      featureFlagsEnabled = true,
      hasEndOfSupplyRespondPermission = true,
      hasEndOfSupplyRequestPermission = false,
      hasMoveInPermission = false,
      hasChangeOfSupplierPermission = false,
      isFas = false,
      actorMarketRole = EicFunction.GridAccessProvider,
      endOfSupplyHandlers = {
        [MeteringPointProcessAction.CancelWorkflow]: {
          featureFlag: 'end-of-supply',
          callback: vi.fn(),
        },
      },
      customerMoveInHandlers = {
        [MeteringPointProcessAction.SendInformation]: {
          callback: vi.fn(),
        },
      },
      secondaryMoveInHandlers = {} as ActionHandlerMap,
      changeOfEnergySupplierHandlers = {
        [MeteringPointProcessAction.SendInformation]: {
          callback: vi.fn(),
        },
      } as ActionHandlerMap,
    } = options;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: DhFeatureFlagsService,
          useValue: { isEnabled: () => featureFlagsEnabled },
        },
        {
          provide: DhReleaseToggleService,
          useValue: { isEnabled: () => releaseTogglesEnabled },
        },
        {
          provide: PermissionService,
          useValue: {
            hasPermission: (permission: Permission) => {
              if (permission === 'metering-point:end-of-supply-respond')
                return of(hasEndOfSupplyRespondPermission);
              if (permission === 'metering-point:end-of-supply-request')
                return of(hasEndOfSupplyRequestPermission);
              if (permission === 'metering-point:move-in') return of(hasMoveInPermission);
              if (permission === 'metering-point:change-of-supplier')
                return of(hasChangeOfSupplierPermission);
              return of(false);
            },
            isFas: () => of(isFas),
          },
        },
        {
          provide: DhActorStorage,
          useValue: {
            getSelectedActor: () => ({
              id: 'actor-1',
              gln: '1234567890123',
              marketRole: actorMarketRole,
              actorName: 'Test Actor',
              organizationName: 'Test Org',
              displayName: 'Test Actor Display',
            }),
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
        {
          provide: SecondaryMoveInActions,
          useValue: createMockHandlers(secondaryMoveInHandlers),
        },
        {
          provide: ChangeOfEnergySupplierActions,
          useValue: createMockHandlers(changeOfEnergySupplierHandlers),
        },
      ],
    });

    return TestBed.inject(DhActionsRegistry);
  }

  describe('getSupportedActions', () => {
    it('should return CancelWorkflow for EndOfSupply when feature flag is enabled', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should return SendInformation for CustomerMoveIn (no feature flag required)', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.CustomerMoveIn,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.SendInformation]);
    });

    it('should filter out actions not registered for the business reason', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow, MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should return empty array when feature flag is disabled', () => {
      const registry = setupRegistry({ featureFlagsEnabled: false });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should return empty array when release toggle is disabled', () => {
      const registry = setupRegistry({
        releaseTogglesEnabled: false,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            featureFlag: 'end-of-supply',
            releaseToggle: 'PM99-SOME-TOGGLE',
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should return action when both feature flag and release toggle are enabled', () => {
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            featureFlag: 'end-of-supply',
            releaseToggle: 'PM99-SOME-TOGGLE',
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should return empty array for unregistered business reason', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.NewMeteringPoint,
        false
      );

      expect(result).toEqual([]);
    });

    it('should return empty array when no available actions', () => {
      const registry = setupRegistry();

      const result = registry.getSupportedActions(
        [],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should return action when user has required permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: true,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            permissions: ['metering-point:end-of-supply-respond'],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.RejectRequest],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.RejectRequest]);
    });

    it('should filter out action when user lacks required permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            permissions: ['metering-point:end-of-supply-respond'],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.RejectRequest],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should allow action without permissions regardless of user permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should return action when user has end-of-supply permission and action allows it', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        hasEndOfSupplyRequestPermission: true,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
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
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.SendInformation]);
    });

    it('should return action when user has end-of-supply-respond permission and action allows both', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: true,
        hasEndOfSupplyRequestPermission: false,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
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
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.SendInformation]);
    });

    it('should filter out action when user has neither required permission', () => {
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        hasEndOfSupplyRequestPermission: false,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
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
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should include action for actor whose role matches handler.roles', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.GridAccessProvider,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.ConfirmWorkflow]: {
            featureFlag: 'end-of-supply',
            roles: [EicFunction.GridAccessProvider],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.ConfirmWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.ConfirmWorkflow]);
    });

    it('should exclude action when actor role is not in handler.roles', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.ConfirmWorkflow]: {
            featureFlag: 'end-of-supply',
            roles: [EicFunction.GridAccessProvider],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.ConfirmWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should include action for ResponsibleEnergySupplier when actor is responsible', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [ResponsibleEnergySupplier],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        true
      );

      expect(result).toEqual([MeteringPointProcessAction.SendInformation]);
    });

    it('should exclude action for ResponsibleEnergySupplier when actor is supplier but not responsible', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [ResponsibleEnergySupplier],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should include action for InitiatingParticipant when actor GLN matches initiator GLN', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false,
        '1234567890123'
      );

      expect(result).toEqual([MeteringPointProcessAction.SendInformation]);
    });

    it('should exclude action for InitiatingParticipant when actor GLN does not match initiator GLN', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false,
        '9999999999999'
      );

      expect(result).toEqual([]);
    });

    it('should exclude action for InitiatingParticipant when initiatorGlnOrEic is not provided', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([]);
    });

    it('should include action when any role in a mixed roles array matches', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.GridAccessProvider,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            featureFlag: 'end-of-supply',
            roles: [ResponsibleEnergySupplier, EicFunction.GridAccessProvider],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should include all actions for FAS regardless of roles', () => {
      const registry = setupRegistry({
        isFas: true,
        actorMarketRole: EicFunction.DataHubAdministrator,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [ResponsibleEnergySupplier],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation],
        ProcessManagerBusinessReason.EndOfSupply,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.SendInformation]);
    });

    it('should return CancelWorkflow for CustomerMoveIn when permission and initiator match', () => {
      const registry = setupRegistry({
        hasMoveInPermission: true,
        actorMarketRole: EicFunction.EnergySupplier,
        customerMoveInHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            callback: vi.fn(),
          },
          [MeteringPointProcessAction.CancelWorkflow]: {
            permissions: ['metering-point:move-in'],
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.CustomerMoveIn,
        false,
        '1234567890123'
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should exclude CancelWorkflow for CustomerMoveIn when initiator GLN does not match', () => {
      const registry = setupRegistry({
        hasMoveInPermission: true,
        actorMarketRole: EicFunction.EnergySupplier,
        customerMoveInHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            callback: vi.fn(),
          },
          [MeteringPointProcessAction.CancelWorkflow]: {
            permissions: ['metering-point:move-in'],
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.CustomerMoveIn,
        false,
        '9999999999999'
      );

      expect(result).toEqual([]);
    });

    it('should exclude CancelWorkflow for CustomerMoveIn when permission is missing', () => {
      const registry = setupRegistry({
        hasMoveInPermission: false,
        actorMarketRole: EicFunction.EnergySupplier,
        customerMoveInHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            callback: vi.fn(),
          },
          [MeteringPointProcessAction.CancelWorkflow]: {
            permissions: ['metering-point:move-in'],
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.CustomerMoveIn,
        false,
        '1234567890123'
      );

      expect(result).toEqual([]);
    });

    it('should return CancelWorkflow for ChangeOfEnergySupplier when permission and initiator match', () => {
      const registry = setupRegistry({
        hasChangeOfSupplierPermission: true,
        actorMarketRole: EicFunction.EnergySupplier,
        changeOfEnergySupplierHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            callback: vi.fn(),
          },
          [MeteringPointProcessAction.CancelWorkflow]: {
            permissions: ['metering-point:change-of-supplier'],
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.ChangeOfEnergySupplier,
        false,
        '1234567890123'
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should exclude CancelWorkflow for ChangeOfEnergySupplier when initiator GLN does not match', () => {
      const registry = setupRegistry({
        hasChangeOfSupplierPermission: true,
        actorMarketRole: EicFunction.EnergySupplier,
        changeOfEnergySupplierHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            callback: vi.fn(),
          },
          [MeteringPointProcessAction.CancelWorkflow]: {
            permissions: ['metering-point:change-of-supplier'],
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.ChangeOfEnergySupplier,
        false,
        '9999999999999'
      );

      expect(result).toEqual([]);
    });

    it('should exclude CancelWorkflow for ChangeOfEnergySupplier when permission is missing', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        changeOfEnergySupplierHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            callback: vi.fn(),
          },
          [MeteringPointProcessAction.CancelWorkflow]: {
            permissions: ['metering-point:change-of-supplier'],
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.ChangeOfEnergySupplier,
        false,
        '1234567890123'
      );

      expect(result).toEqual([]);
    });

    it('should return actions sorted in canonical display order regardless of input order', () => {
      const registry = setupRegistry({
        customerMoveInHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            callback: vi.fn(),
          },
          [MeteringPointProcessAction.CancelWorkflow]: {
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow],
        ProcessManagerBusinessReason.CustomerMoveIn,
        false
      );

      expect(result).toEqual([
        MeteringPointProcessAction.CancelWorkflow,
        MeteringPointProcessAction.SendInformation,
      ]);
    });

    it('should include InitiateIncorrectMoveIn for CustomerMoveIn without role or permission gates', () => {
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        customerMoveInHandlers: {
          [MeteringPointProcessAction.InitiateIncorrectMoveIn]: {
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getSupportedActions(
        [MeteringPointProcessAction.InitiateIncorrectMoveIn],
        ProcessManagerBusinessReason.CustomerMoveIn,
        false
      );

      expect(result).toEqual([MeteringPointProcessAction.InitiateIncorrectMoveIn]);
    });
  });

  describe('execute', () => {
    it('should call the correct handler callback', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: { callback },
        },
      });

      registry.execute(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext,
        false
      );

      expect(callback).toHaveBeenCalledWith(mockContext);
    });

    it('should not throw for unregistered business reason', () => {
      const registry = setupRegistry();

      expect(() =>
        registry.execute(
          MeteringPointProcessAction.CancelWorkflow,
          ProcessManagerBusinessReason.NewMeteringPoint,
          mockContext,
          false
        )
      ).not.toThrow();
    });

    it('should not throw for unregistered action', () => {
      const registry = setupRegistry();

      expect(() =>
        registry.execute(
          MeteringPointProcessAction.SendInformation,
          ProcessManagerBusinessReason.EndOfSupply,
          mockContext,
          false
        )
      ).not.toThrow();
    });

    it('should not call handler when user lacks required permission', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        hasEndOfSupplyRespondPermission: false,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.RejectRequest]: {
            featureFlag: 'end-of-supply',
            permissions: ['metering-point:end-of-supply-respond'],
            callback,
          },
        },
      });

      registry.execute(
        MeteringPointProcessAction.RejectRequest,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext,
        false
      );

      expect(callback).not.toHaveBeenCalled();
    });

    it('should pass onSuccess callback through context', () => {
      const callback = vi.fn();
      const onSuccess = vi.fn();
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: { callback },
        },
      });

      registry.execute(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.EndOfSupply,
        {
          ...mockContext,
          onSuccess,
        },
        false
      );

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ onSuccess }));
    });

    it('should not call handler when actor role is not allowed', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.ConfirmWorkflow]: {
            featureFlag: 'end-of-supply',
            roles: [EicFunction.GridAccessProvider],
            callback,
          },
        },
      });

      registry.execute(
        MeteringPointProcessAction.ConfirmWorkflow,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext,
        false
      );

      expect(callback).not.toHaveBeenCalled();
    });

    it('should not call handler for FAS users even when action would otherwise be supported', () => {
      const callback = vi.fn();
      const baseSetup = {
        endOfSupplyHandlers: { [MeteringPointProcessAction.CancelWorkflow]: { callback } },
      };

      // Sanity: without FAS, the same setup DOES invoke the handler.
      // This proves the trigger is wired up before we assert the FAS-block.
      const nonFas = setupRegistry(baseSetup);
      nonFas.execute(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext,
        false
      );
      expect(callback).toHaveBeenCalledTimes(1);
      callback.mockClear();

      // With FAS, the same trigger does NOT invoke the handler.
      TestBed.resetTestingModule();
      const fas = setupRegistry({ ...baseSetup, isFas: true });
      fas.execute(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext,
        false
      );
      expect(callback).not.toHaveBeenCalled();
    });

    it('should call handler when InitiatingParticipant role matches (actor GLN equals initiator GLN)', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [InitiatingParticipant],
            callback,
          },
        },
      });

      registry.execute(
        MeteringPointProcessAction.SendInformation,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext,
        false,
        '1234567890123'
      );

      expect(callback).toHaveBeenCalledWith(mockContext);
    });

    it('should not call handler when InitiatingParticipant role does not match (different GLN)', () => {
      const callback = vi.fn();
      const registry = setupRegistry({
        actorMarketRole: EicFunction.EnergySupplier,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            featureFlag: 'end-of-supply',
            roles: [InitiatingParticipant],
            callback,
          },
        },
      });

      registry.execute(
        MeteringPointProcessAction.SendInformation,
        ProcessManagerBusinessReason.EndOfSupply,
        mockContext,
        true,
        '9999999999999'
      );

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('getActorRolesForAction', () => {
    it('should derive [EnergySupplier] from [ResponsibleEnergySupplier]', () => {
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            roles: [ResponsibleEnergySupplier],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.SendInformation,
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([EicFunction.EnergySupplier]);
    });

    it('should derive [EnergySupplier, GridAccessProvider] from [InitiatingParticipant]', () => {
      const registry = setupRegistry({
        customerMoveInHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.SendInformation,
        ProcessManagerBusinessReason.CustomerMoveIn
      );

      expect(result).toEqual([EicFunction.EnergySupplier, EicFunction.GridAccessProvider]);
    });

    it('should deduplicate when concrete and sentinel roles overlap', () => {
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            roles: [EicFunction.GridAccessProvider, EicFunction.EnergySupplier],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.GridAccessProvider, EicFunction.EnergySupplier])
      );
    });

    it('should return [] when handler has no roles', () => {
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([]);
    });

    it('should return [] for unregistered action', () => {
      const registry = setupRegistry();

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.RejectRequest,
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([]);
    });

    it('should intersect role expansions when requireAllRoles is set', () => {
      // ResponsibleEnergySupplier expands to [EnergySupplier]; InitiatingParticipant expands to
      // [EnergySupplier, GridAccessProvider]. With AND-gate the intersection is [EnergySupplier],
      // so the FAS drawer must not render a GridAccessProvider group for this action.
      const registry = setupRegistry({
        customerMoveInHandlers: {
          [MeteringPointProcessAction.InitiateIncorrectMoveIn]: {
            roles: [ResponsibleEnergySupplier, InitiatingParticipant],
            requireAllRoles: true,
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.InitiateIncorrectMoveIn,
        ProcessManagerBusinessReason.CustomerMoveIn
      );

      expect(result).toEqual([EicFunction.EnergySupplier]);
    });
  });
});
