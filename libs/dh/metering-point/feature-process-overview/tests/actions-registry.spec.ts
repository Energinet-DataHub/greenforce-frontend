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
  ElectricityMarketViewConnectionState,
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
import { IncorrectMoveActions } from '../src/actions/incorrect-move/incorrect-move';
import { RollbackChangeOfSupplierActions } from '../src/actions/rollback-change-of-supplier/rollback-change-of-supplier';
import { ServiceRequestActions } from '../src/actions/service-request/service-request';
import { ProcessActionContext } from '../src/actions/context';

// -- Test helpers --

const mockContext: ProcessActionContext = {
  meteringPointId: 'mp-1',
  internalMeteringPointId: 'imp-1',
  processId: 'process-1',
  connectionState: ElectricityMarketViewConnectionState.Disconnected,
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
      hasServiceRequestRequestPermission?: boolean;
      hasServiceRequestRespondPermission?: boolean;
      isFas?: boolean;
      actorMarketRole?: EicFunction;
      endOfSupplyHandlers?: ActionHandlerMap;
      customerMoveInHandlers?: ActionHandlerMap;
      secondaryMoveInHandlers?: ActionHandlerMap;
      changeOfEnergySupplierHandlers?: ActionHandlerMap;
      incorrectMoveHandlers?: ActionHandlerMap;
      rollbackChangeOfSupplierHandlers?: ActionHandlerMap;
      serviceRequestHandlers?: ActionHandlerMap;
    } = {}
  ) {
    const {
      releaseTogglesEnabled = true,
      featureFlagsEnabled = true,
      hasEndOfSupplyRespondPermission = true,
      hasEndOfSupplyRequestPermission = false,
      hasMoveInPermission = false,
      hasChangeOfSupplierPermission = false,
      hasServiceRequestRequestPermission = false,
      hasServiceRequestRespondPermission = false,
      isFas = false,
      actorMarketRole = EicFunction.GridAccessProvider,
      endOfSupplyHandlers = {
        [MeteringPointProcessAction.CancelWorkflow]: {
          releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
      incorrectMoveHandlers = {} as ActionHandlerMap,
      rollbackChangeOfSupplierHandlers = {} as ActionHandlerMap,
      serviceRequestHandlers = {} as ActionHandlerMap,
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
              if (permission === 'metering-point:service-request-request')
                return of(hasServiceRequestRequestPermission);
              if (permission === 'metering-point:service-request-respond')
                return of(hasServiceRequestRespondPermission);
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
        {
          provide: IncorrectMoveActions,
          useValue: createMockHandlers(incorrectMoveHandlers),
        },
        {
          provide: RollbackChangeOfSupplierActions,
          useValue: createMockHandlers(rollbackChangeOfSupplierHandlers),
        },
        {
          provide: ServiceRequestActions,
          useValue: createMockHandlers(serviceRequestHandlers),
        },
      ],
    });

    return TestBed.inject(DhActionsRegistry);
  }

  describe('getSupportedActions', () => {
    it('should return CancelWorkflow for EndOfSupply when release toggle is enabled', () => {
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
      // The registry still supports the generic `featureFlag` gate even though no
      // production action uses it; `dev-examples` is a still-registered flag used
      // here purely to exercise that gate.
      const registry = setupRegistry({
        featureFlagsEnabled: false,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            featureFlag: 'dev-examples',
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

    it('should return empty array when release toggle is disabled', () => {
      const registry = setupRegistry({
        releaseTogglesEnabled: false,
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            featureFlag: 'dev-examples',
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
            featureFlag: 'dev-examples',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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

    it('should return CancelWorkflow for SecondaryMoveIn when permission and initiator match', () => {
      const registry = setupRegistry({
        hasMoveInPermission: true,
        actorMarketRole: EicFunction.EnergySupplier,
        secondaryMoveInHandlers: {
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
        ProcessManagerBusinessReason.SecondaryMoveIn,
        false,
        '1234567890123'
      );

      expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
    });

    it('should exclude CancelWorkflow for SecondaryMoveIn when initiator GLN does not match', () => {
      const registry = setupRegistry({
        hasMoveInPermission: true,
        actorMarketRole: EicFunction.EnergySupplier,
        secondaryMoveInHandlers: {
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
        ProcessManagerBusinessReason.SecondaryMoveIn,
        false,
        '9999999999999'
      );

      expect(result).toEqual([]);
    });

    it('should exclude CancelWorkflow for SecondaryMoveIn when permission is missing', () => {
      const registry = setupRegistry({
        hasMoveInPermission: false,
        actorMarketRole: EicFunction.EnergySupplier,
        secondaryMoveInHandlers: {
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
        ProcessManagerBusinessReason.SecondaryMoveIn,
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

    describe('InitiatingParticipant gate (BRS-011 ownership rule)', () => {
      // The BRS-011 button is gated by InitiatingParticipant alone: only the
      // actor that initiated the move-in process can request its correction.
      // The actor's GLN is fixed at '1234567890123' by the setupRegistry
      // DhActorStorage mock; we toggle the initiator GLN by passing it (or a
      // non-matching value) as the 4th argument to getSupportedActions.

      const matchingInitiatorGln = '1234567890123';
      const nonMatchingInitiatorGln = '9999999999999';

      it('should include the action when actor.gln matches the process initiator', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          customerMoveInHandlers: {
            [MeteringPointProcessAction.InitiateIncorrectMoveIn]: {
              roles: [InitiatingParticipant],
              callback: vi.fn(),
            },
          },
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.InitiateIncorrectMoveIn],
          ProcessManagerBusinessReason.CustomerMoveIn,
          true,
          matchingInitiatorGln
        );

        expect(result).toContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
      });

      it('should exclude the action when actor.gln does NOT match the process initiator', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          customerMoveInHandlers: {
            [MeteringPointProcessAction.InitiateIncorrectMoveIn]: {
              roles: [InitiatingParticipant],
              callback: vi.fn(),
            },
          },
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.InitiateIncorrectMoveIn],
          ProcessManagerBusinessReason.CustomerMoveIn,
          true,
          nonMatchingInitiatorGln
        );

        expect(result).not.toContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
      });

      it('should not consult isResponsible: actor.gln match alone decides visibility', () => {
        // Responsibility is irrelevant for the new rule. Same matching GLN with
        // responsibility flipped to false must still produce the action.
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          customerMoveInHandlers: {
            [MeteringPointProcessAction.InitiateIncorrectMoveIn]: {
              roles: [InitiatingParticipant],
              callback: vi.fn(),
            },
          },
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.InitiateIncorrectMoveIn],
          ProcessManagerBusinessReason.CustomerMoveIn,
          false,
          matchingInitiatorGln
        );

        expect(result).toContain(MeteringPointProcessAction.InitiateIncorrectMoveIn);
      });
    });

    describe('ServiceRequest (BRS-039)', () => {
      // Mirrors the EndOfSupply registry cases. CancelWorkflow is performed by the
      // responsible energy supplier that initiated the request and is gated by the
      // `service-request-request` permission; ConfirmWorkflow is performed by the
      // grid access provider and is gated by the `service-request-respond` permission.
      // All are behind the `PM51-END-OF-SUPPLY-CIM` release toggle.

      const cancelHandlers: ActionHandlerMap = {
        [MeteringPointProcessAction.CancelWorkflow]: {
          releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
          permissions: ['metering-point:service-request-request'],
          roles: [ResponsibleEnergySupplier],
          callback: vi.fn(),
        },
      };

      const confirmHandlers: ActionHandlerMap = {
        [MeteringPointProcessAction.ConfirmWorkflow]: {
          releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
          permissions: ['metering-point:service-request-respond'],
          roles: [EicFunction.GridAccessProvider],
          callback: vi.fn(),
        },
      };

      const rejectHandlers: ActionHandlerMap = {
        [MeteringPointProcessAction.RejectRequest]: {
          releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
          permissions: ['metering-point:service-request-respond'],
          roles: [EicFunction.GridAccessProvider],
          callback: vi.fn(),
        },
      };

      it('should return CancelWorkflow when release toggle enabled, request permission present and actor is responsible supplier', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          hasServiceRequestRequestPermission: true,
          serviceRequestHandlers: cancelHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.CancelWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          true
        );

        expect(result).toEqual([MeteringPointProcessAction.CancelWorkflow]);
      });

      it('should exclude CancelWorkflow when request permission is missing', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          hasServiceRequestRequestPermission: false,
          serviceRequestHandlers: cancelHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.CancelWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          true
        );

        expect(result).toEqual([]);
      });

      it('should exclude CancelWorkflow when actor is supplier but not responsible', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          hasServiceRequestRequestPermission: true,
          serviceRequestHandlers: cancelHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.CancelWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([]);
      });

      it('should exclude CancelWorkflow when release toggle is disabled', () => {
        const registry = setupRegistry({
          releaseTogglesEnabled: false,
          actorMarketRole: EicFunction.EnergySupplier,
          hasServiceRequestRequestPermission: true,
          serviceRequestHandlers: cancelHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.CancelWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          true
        );

        expect(result).toEqual([]);
      });

      it('should return ConfirmWorkflow when release toggle enabled, respond permission present and actor is GridAccessProvider', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.GridAccessProvider,
          hasServiceRequestRespondPermission: true,
          serviceRequestHandlers: confirmHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.ConfirmWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([MeteringPointProcessAction.ConfirmWorkflow]);
      });

      it('should exclude ConfirmWorkflow when respond permission is missing', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.GridAccessProvider,
          hasServiceRequestRespondPermission: false,
          serviceRequestHandlers: confirmHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.ConfirmWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([]);
      });

      it('should exclude ConfirmWorkflow when actor role is not GridAccessProvider', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          hasServiceRequestRespondPermission: true,
          serviceRequestHandlers: confirmHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.ConfirmWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([]);
      });

      it('should exclude ConfirmWorkflow when release toggle is disabled', () => {
        const registry = setupRegistry({
          releaseTogglesEnabled: false,
          actorMarketRole: EicFunction.GridAccessProvider,
          hasServiceRequestRespondPermission: true,
          serviceRequestHandlers: confirmHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.ConfirmWorkflow],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([]);
      });

      it('should return RejectRequest when release toggle enabled, respond permission present and actor is GridAccessProvider', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.GridAccessProvider,
          hasServiceRequestRespondPermission: true,
          serviceRequestHandlers: rejectHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.RejectRequest],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([MeteringPointProcessAction.RejectRequest]);
      });

      it('should exclude RejectRequest when respond permission is missing', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.GridAccessProvider,
          hasServiceRequestRespondPermission: false,
          serviceRequestHandlers: rejectHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.RejectRequest],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([]);
      });

      it('should exclude RejectRequest when actor role is not GridAccessProvider', () => {
        const registry = setupRegistry({
          actorMarketRole: EicFunction.EnergySupplier,
          hasServiceRequestRespondPermission: true,
          serviceRequestHandlers: rejectHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.RejectRequest],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([]);
      });

      it('should exclude RejectRequest when release toggle is disabled', () => {
        const registry = setupRegistry({
          releaseTogglesEnabled: false,
          actorMarketRole: EicFunction.GridAccessProvider,
          hasServiceRequestRespondPermission: true,
          serviceRequestHandlers: rejectHandlers,
        });

        const result = registry.getSupportedActions(
          [MeteringPointProcessAction.RejectRequest],
          ProcessManagerBusinessReason.ServiceRequest,
          false
        );

        expect(result).toEqual([]);
      });
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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
            releaseToggle: 'PM51-END-OF-SUPPLY-CIM',
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

    // -- Regression sweep: every concrete handler configuration declared across all action files
    // must produce the same EicFunction[] result that the original union-only code produced.
    // If any of these assertions break, a handler's actor-role display has silently changed shape.

    it('regression: EndOfSupply SendInformation / CancelWorkflow [ResponsibleEnergySupplier] -> [EnergySupplier]', () => {
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

    it('regression: EndOfSupply ConfirmWorkflow / RejectRequest [GridAccessProvider] -> [GridAccessProvider]', () => {
      const registry = setupRegistry({
        endOfSupplyHandlers: {
          [MeteringPointProcessAction.ConfirmWorkflow]: {
            roles: [EicFunction.GridAccessProvider],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.ConfirmWorkflow,
        ProcessManagerBusinessReason.EndOfSupply
      );

      expect(result).toEqual([EicFunction.GridAccessProvider]);
    });

    it('regression: CustomerMoveIn SendInformation [InitiatingParticipant, GridAccessProvider] -> [EnergySupplier, GridAccessProvider]', () => {
      const registry = setupRegistry({
        customerMoveInHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            roles: [InitiatingParticipant, EicFunction.GridAccessProvider],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.SendInformation,
        ProcessManagerBusinessReason.CustomerMoveIn
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.EnergySupplier, EicFunction.GridAccessProvider])
      );
    });

    it('regression: CustomerMoveIn CancelWorkflow [InitiatingParticipant] -> [EnergySupplier, GridAccessProvider]', () => {
      const registry = setupRegistry({
        customerMoveInHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.CustomerMoveIn
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.EnergySupplier, EicFunction.GridAccessProvider])
      );
    });

    it('regression: SecondaryMoveIn SendInformation [InitiatingParticipant, GridAccessProvider] -> [EnergySupplier, GridAccessProvider]', () => {
      const registry = setupRegistry({
        secondaryMoveInHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            roles: [InitiatingParticipant, EicFunction.GridAccessProvider],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.SendInformation,
        ProcessManagerBusinessReason.SecondaryMoveIn
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.EnergySupplier, EicFunction.GridAccessProvider])
      );
    });

    it('regression: SecondaryMoveIn CancelWorkflow [InitiatingParticipant] -> [EnergySupplier, GridAccessProvider]', () => {
      const registry = setupRegistry({
        secondaryMoveInHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.SecondaryMoveIn
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.EnergySupplier, EicFunction.GridAccessProvider])
      );
    });

    it('regression: ChangeOfEnergySupplier SendInformation [InitiatingParticipant, GridAccessProvider] -> [EnergySupplier, GridAccessProvider]', () => {
      const registry = setupRegistry({
        changeOfEnergySupplierHandlers: {
          [MeteringPointProcessAction.SendInformation]: {
            roles: [InitiatingParticipant, EicFunction.GridAccessProvider],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.SendInformation,
        ProcessManagerBusinessReason.ChangeOfEnergySupplier
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.EnergySupplier, EicFunction.GridAccessProvider])
      );
    });

    it('regression: ChangeOfEnergySupplier CancelWorkflow [InitiatingParticipant] -> [EnergySupplier, GridAccessProvider]', () => {
      const registry = setupRegistry({
        changeOfEnergySupplierHandlers: {
          [MeteringPointProcessAction.CancelWorkflow]: {
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.CancelWorkflow,
        ProcessManagerBusinessReason.ChangeOfEnergySupplier
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.EnergySupplier, EicFunction.GridAccessProvider])
      );
    });

    it('smoke: CustomerMoveIn InitiateIncorrectMoveIn [InitiatingParticipant] -> [EnergySupplier, GridAccessProvider]', () => {
      // The BRS-011 button is gated by InitiatingParticipant alone, so the FAS drawer
      // groups it under both initiator-eligible roles per INITIATOR_ROLE_UNIVERSE.
      const registry = setupRegistry({
        customerMoveInHandlers: {
          [MeteringPointProcessAction.InitiateIncorrectMoveIn]: {
            roles: [InitiatingParticipant],
            callback: vi.fn(),
          },
        },
      });

      const result = registry.getActorRolesForAction(
        MeteringPointProcessAction.InitiateIncorrectMoveIn,
        ProcessManagerBusinessReason.CustomerMoveIn
      );

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([EicFunction.EnergySupplier, EicFunction.GridAccessProvider])
      );
    });
  });
});
