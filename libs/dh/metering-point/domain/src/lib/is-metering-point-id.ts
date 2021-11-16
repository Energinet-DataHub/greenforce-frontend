import { meteringPointIdPattern } from './metering-point-id-pattern';

/**
 * Validates that a metering point id is exactly 18 digits
 */
export function isMeteringPointId(maybeMeteringPointId: string): boolean {
  return meteringPointIdPattern.test(maybeMeteringPointId);
}
