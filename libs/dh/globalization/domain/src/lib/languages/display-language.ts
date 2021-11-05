export enum DisplayLanguage {
  Danish = 'da',
  English = 'en',
}

export function assertDisplayLanguage(
  language: string
): asserts language is DisplayLanguage {
  if (!displayLanguages.includes(language as DisplayLanguage)) {
    throw new Error(`Unknown display language: ${language}`);
  }
}

/**
 *
 * @throws {Error} if the specified language is an unknown display language.
 */
export function toDisplayLanguage(language: string): DisplayLanguage {
  assertDisplayLanguage(language);

  return language;
}

export const displayLanguages: readonly DisplayLanguage[] =
  Object.values(DisplayLanguage);
