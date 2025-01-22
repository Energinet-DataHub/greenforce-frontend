const meteringPointIdPattern = /^\d{18}$/;

export function isValidMeteringPointId(maybeMeteringPointId: string): boolean {
  return meteringPointIdPattern.test(maybeMeteringPointId);
}
