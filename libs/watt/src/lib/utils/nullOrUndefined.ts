export function nullOrUndefined(a: unknown): a is null | undefined {
  return a == null;
}
