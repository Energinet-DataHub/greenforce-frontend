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

const WINDOW_DAYS = 60;

const isActive = (process: MeteringPointProcessForVisibility): boolean =>
  process.state === MeteringPointProcessState.Pending ||
  process.state === MeteringPointProcessState.Running;

const isCompleted = (process: MeteringPointProcessForVisibility): boolean =>
  process.state === MeteringPointProcessState.Succeeded;

/**
 * Decides whether the BRS-003 "Request correction: Incorrect change of supplier"
 * button is visible for the completed change-of-supplier process `process`,
 * given every process on the metering point (`processes`) and the current day
 * (`today`, expected to be `dayjs().startOf('day').toDate()`).
 *
 * All date comparisons are at calendar-day granularity.
 */
export function isHandlingOfIncorrectChangeOfSupplierVisible(
  process: MeteringPointProcessForVisibility,
  processes: readonly MeteringPointProcessForVisibility[],
  today: Date
): boolean {
  if (process.businessReason !== ProcessManagerBusinessReason.ChangeOfEnergySupplier) return false;
  if (!isCompleted(process)) return false;
  if (!process.cutoffDate) return false;

  const windowStart = dayjs(today).subtract(WINDOW_DAYS, 'day');
  const isWithinValidityWindow = dayjs(process.cutoffDate).isBetween(
    windowStart,
    today,
    'day',
    '[]'
  );
  if (!isWithinValidityWindow) return false;

  const pv = process.cutoffDate;
  const others = processes.filter((other) => other.id !== process.id);

  const isSupplierChangeAfter = (other: MeteringPointProcessForVisibility): boolean =>
    other.businessReason === ProcessManagerBusinessReason.ChangeOfEnergySupplier &&
    !!other.cutoffDate &&
    dayjs(other.cutoffDate).isAfter(dayjs(pv), 'day');

  const isMostRecentCompletedSupplierChange = !others.some(
    (other) =>
      isSupplierChangeAfter(other) &&
      isCompleted(other) &&
      // A completed supplier change with a future cut-off date does not unseat P.
      !dayjs(other.cutoffDate).isAfter(today, 'day')
  );
  if (!isMostRecentCompletedSupplierChange) return false;

  const hasNewerInflightSupplierChange = others.some(
    (other) =>
      isSupplierChangeAfter(other) &&
      isActive(other) &&
      dayjs(other.cutoffDate).isBetween(windowStart, today, 'day', '[]')
  );
  if (hasNewerInflightSupplierChange) return false;

  // AC2 competing processes whose validity is strictly after P's.
  const competingAfter = others.filter(
    (other) => !!other.cutoffDate && dayjs(other.cutoffDate).isAfter(dayjs(pv), 'day')
  );
  const isSupersededByCompetingProcess = competingAfter.some((other) => {
    switch (other.businessReason) {
      case ProcessManagerBusinessReason.EndOfSupply:
      case ProcessManagerBusinessReason.RollbackChangeOfSupplier:
      case ProcessManagerBusinessReason.CloseDownMeteringPoint:
      case ProcessManagerBusinessReason.CustomerMoveOut:
      case ProcessManagerBusinessReason.ProductionObligation:
        return isActive(other) || isCompleted(other);
      // A future/active move-in does not hide; only a completed one supersedes.
      case ProcessManagerBusinessReason.CustomerMoveIn:
        return isCompleted(other);
      default:
        return false;
    }
  });
  if (isSupersededByCompetingProcess) return false;

  // BRS-011: an incorrect move-in initiated after P's validity that corrects an
  // earlier move-in whose validity precedes P's.
  const isSupersededByIncorrectMove = others.some(
    (other) =>
      other.businessReason === ProcessManagerBusinessReason.IncorrectMove &&
      (isActive(other) || isCompleted(other)) &&
      dayjs(other.createdAt).isAfter(dayjs(pv), 'day') &&
      !!other.cutoffDate &&
      dayjs(other.cutoffDate).isBefore(dayjs(pv), 'day')
  );
  if (isSupersededByIncorrectMove) return false;

  return true;
}
