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
import { dayjs } from '@energinet/watt/date';
import {
  MeteringPointProcessState,
  ProcessManagerBusinessReason,
} from '@energinet-datahub/dh/shared/domain/graphql';

import type { MeteringPointProcessForVisibility } from '../context';

import { isHandlingOfIncorrectChangeOfSupplierVisible } from './incorrect-change-of-supplier-visibility';

// A fixed "today" so every test is deterministic regardless of the real clock.
const today = dayjs('2026-06-17').startOf('day').toDate();

// Calendar-day offset relative to `today` (negative = past, positive = future).
const day = (offset: number) => dayjs(today).add(offset, 'day').toDate();

// The ChangeOfEnergySupplier process the button belongs to: completed, with a
// cut-off date 10 days ago (well inside the 60-day window).
const baseProcess: MeteringPointProcessForVisibility = {
  id: 'P',
  businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
  state: MeteringPointProcessState.Succeeded,
  cutoffDate: day(-10),
  createdAt: day(-40),
};

function makeProcess(
  over: Partial<MeteringPointProcessForVisibility> & { id: string }
): MeteringPointProcessForVisibility {
  return {
    businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
    state: MeteringPointProcessState.Succeeded,
    cutoffDate: day(-10),
    createdAt: day(-40),
    ...over,
  };
}

function isVisible(
  process: MeteringPointProcessForVisibility,
  siblings: MeteringPointProcessForVisibility[] = []
) {
  return isHandlingOfIncorrectChangeOfSupplierVisible(process, [process, ...siblings], today);
}

describe('isHandlingOfIncorrectChangeOfSupplierVisible', () => {
  describe('acceptance cases per business rule', () => {
    it('TC1 (BRS-001): shows when a newer change of supplier has a future cut-off date', () => {
      const futureSupplierChange = makeProcess({
        id: 'cos-future',
        state: MeteringPointProcessState.Running,
        cutoffDate: day(5),
      });

      expect(isVisible(baseProcess, [futureSupplierChange])).toBe(true);
    });

    it('TC2 (BRS-002): hidden when an active end of supply has a later cut-off date', () => {
      const endOfSupply = makeProcess({
        id: 'eos',
        businessReason: ProcessManagerBusinessReason.EndOfSupply,
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [endOfSupply])).toBe(false);
    });

    it('TC3.1 (BRS-003): hidden when an active rollback of change of supplier has a later cut-off date', () => {
      const rollback = makeProcess({
        id: 'rollback',
        businessReason: ProcessManagerBusinessReason.RollbackChangeOfSupplier,
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [rollback])).toBe(false);
    });

    it('TC3.2 (BRS-003): hidden when a newer completed change of supplier exists', () => {
      const newerCompletedSupplierChange = makeProcess({
        id: 'cos-newer',
        state: MeteringPointProcessState.Succeeded,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [newerCompletedSupplierChange])).toBe(false);
    });

    it('TC4 (BRS-007): hidden when a close down metering point has a later cut-off date', () => {
      const closeDown = makeProcess({
        id: 'close-down',
        businessReason: ProcessManagerBusinessReason.CloseDownMeteringPoint,
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [closeDown])).toBe(false);
    });

    it('TC5 (BRS-009 no1): shows when an active (not completed) move-in has a later cut-off date', () => {
      const activeMoveIn = makeProcess({
        id: 'move-in-active',
        businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [activeMoveIn])).toBe(true);
    });

    it('TC6 (BRS-009 no2): hidden when a completed move-in has a later cut-off date', () => {
      const completedMoveIn = makeProcess({
        id: 'move-in-completed',
        businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
        state: MeteringPointProcessState.Succeeded,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [completedMoveIn])).toBe(false);
    });

    it('TC7 (BRS-010): hidden when an active move-out has a later cut-off date', () => {
      const moveOut = makeProcess({
        id: 'move-out',
        businessReason: ProcessManagerBusinessReason.CustomerMoveOut,
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [moveOut])).toBe(false);
    });

    it('TC8 (BRS-011): hidden when an incorrect move-in was initiated after P, correcting an earlier move-in', () => {
      const incorrectMove = makeProcess({
        id: 'incorrect-move',
        businessReason: ProcessManagerBusinessReason.IncorrectMove,
        state: MeteringPointProcessState.Running,
        createdAt: day(-5),
        cutoffDate: day(-20),
      });

      expect(isVisible(baseProcess, [incorrectMove])).toBe(false);
    });

    it('TC9 (BRS-036): hidden when an active production obligation has a later cut-off date', () => {
      const productionObligation = makeProcess({
        id: 'production-obligation',
        businessReason: ProcessManagerBusinessReason.ProductionObligation,
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [productionObligation])).toBe(false);
    });
  });

  describe('validity window edge cases', () => {
    it('shows when the cut-off date is exactly today (upper boundary)', () => {
      expect(isVisible({ ...baseProcess, cutoffDate: day(0) })).toBe(true);
    });

    it('shows when the cut-off date is exactly 60 days ago (lower boundary)', () => {
      expect(isVisible({ ...baseProcess, cutoffDate: day(-60) })).toBe(true);
    });

    it('hidden when the cut-off date is older than 60 days', () => {
      expect(isVisible({ ...baseProcess, cutoffDate: day(-61) })).toBe(false);
    });

    it('hidden when the cut-off date is in the future', () => {
      expect(isVisible({ ...baseProcess, cutoffDate: day(1) })).toBe(false);
    });

    it('hidden when the cut-off date is missing', () => {
      expect(isVisible({ ...baseProcess, cutoffDate: null })).toBe(false);
    });
  });

  describe('process state', () => {
    it('hidden when P is pending (not completed)', () => {
      expect(isVisible({ ...baseProcess, state: MeteringPointProcessState.Pending })).toBe(false);
    });

    it('hidden when P is running (not completed)', () => {
      expect(isVisible({ ...baseProcess, state: MeteringPointProcessState.Running })).toBe(false);
    });

    it('hidden when P is not a change of supplier process', () => {
      expect(
        isVisible({ ...baseProcess, businessReason: ProcessManagerBusinessReason.EndOfSupply })
      ).toBe(false);
    });
  });

  describe('competing process boundaries', () => {
    it('shows when a competing process has an equal cut-off date (not strictly after P)', () => {
      const equalEndOfSupply = makeProcess({
        id: 'eos-equal',
        businessReason: ProcessManagerBusinessReason.EndOfSupply,
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-10),
      });

      expect(isVisible(baseProcess, [equalEndOfSupply])).toBe(true);
    });

    it('shows when a competing process is canceled (ignored regardless of cut-off date)', () => {
      const canceledEndOfSupply = makeProcess({
        id: 'eos-canceled',
        businessReason: ProcessManagerBusinessReason.EndOfSupply,
        state: MeteringPointProcessState.Canceled,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [canceledEndOfSupply])).toBe(true);
    });

    it('shows the happy path when P is the only process', () => {
      expect(isVisible(baseProcess)).toBe(true);
    });
  });

  describe('branch falsifiability (each gate independently load-bearing)', () => {
    it('hidden when a newer in-flight change of supplier is within the window', () => {
      const newerInflightSupplierChange = makeProcess({
        id: 'cos-inflight',
        state: MeteringPointProcessState.Running,
        cutoffDate: day(-5), // after P (-10) and inside the window
      });

      expect(isVisible(baseProcess, [newerInflightSupplierChange])).toBe(false);
    });

    it('shows when a newer completed change of supplier has a future cut-off date (does not unseat P)', () => {
      const futureCompletedSupplierChange = makeProcess({
        id: 'cos-future-completed',
        state: MeteringPointProcessState.Succeeded,
        cutoffDate: day(5),
      });

      expect(isVisible(baseProcess, [futureCompletedSupplierChange])).toBe(true);
    });

    it('hidden when a completed (not active) competing process has a later cut-off date', () => {
      const completedEndOfSupply = makeProcess({
        id: 'eos-completed',
        businessReason: ProcessManagerBusinessReason.EndOfSupply,
        state: MeteringPointProcessState.Succeeded,
        cutoffDate: day(-5),
      });

      expect(isVisible(baseProcess, [completedEndOfSupply])).toBe(false);
    });

    it('shows when an incorrect move-in corrects a later move-in (its cut-off is after P)', () => {
      const incorrectMoveLaterCutoff = makeProcess({
        id: 'incorrect-move-later',
        businessReason: ProcessManagerBusinessReason.IncorrectMove,
        state: MeteringPointProcessState.Running,
        createdAt: day(-5),
        cutoffDate: day(5),
      });

      expect(isVisible(baseProcess, [incorrectMoveLaterCutoff])).toBe(true);
    });

    it('shows when a matching incorrect move-in is in a terminal state (canceled is ignored)', () => {
      const canceledIncorrectMove = makeProcess({
        id: 'incorrect-move-canceled',
        businessReason: ProcessManagerBusinessReason.IncorrectMove,
        state: MeteringPointProcessState.Canceled,
        createdAt: day(-5),
        cutoffDate: day(-20),
      });

      expect(isVisible(baseProcess, [canceledIncorrectMove])).toBe(true);
    });
  });
});
