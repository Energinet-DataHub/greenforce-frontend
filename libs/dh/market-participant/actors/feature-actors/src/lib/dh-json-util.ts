export function dhToJSON<T>(value: T): string {
  return JSON.stringify(value);
}

export function dhParseJSON<T>(filtersJSON: string): T {
  try {
    return JSON.parse(filtersJSON) as T;
  } catch (error) {
    throw new Error(`Invalid JSON: ${filtersJSON}`);
  }
}
