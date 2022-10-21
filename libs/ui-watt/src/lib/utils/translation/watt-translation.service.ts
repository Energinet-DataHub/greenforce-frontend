import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

type Translation = { [x: string]: string | Translation };
type KeyValueObject = { key: string; value: string };

/**
 * Service for providing translations in Watt components using Transloco.
 *
 * __Only for internal use, must not be used outside Watt.__
 */
@Injectable({ providedIn: 'root' })
export class WattTranslationService {
  private transloco = inject(TranslocoService);

  /**
   * Recursively parses a translation object, flattening the object into
   * an array of key-value pairs, where the keys correspond to the
   * full object path for each property.
   *
   * @example
   * // [{ key: 'path.to.deep.property', value: 'deep'}]
   * getTranslationKeyValuePairs('path.to', {
   *   deep: { property: "deep" }
   * })
   */
  private getTranslationKeyValuePairs(
    prefix: string,
    object: Translation
  ): KeyValueObject[] {
    return Object.keys(object)
      .map((key) => [key, object[key]])
      .flatMap(([key, value]) =>
        typeof value === 'string'
          ? { key: `${prefix}.${key}`, value }
          : this.getTranslationKeyValuePairs(`${prefix}.${key}`, value)
      );
  }

  /** Check if translation key already exists for specific language. */
  hasTranslation(key: string, lang: string) {
    return typeof this.transloco.getTranslation(lang)[key] === 'string';
  }

  /**
   * Add the translation to the global Watt translation config under the
   * provided `prefix`. Does not overwrite existing translations.
   */
  addTranslation(prefix: string, translation: Translation, lang: string) {
    this.getTranslationKeyValuePairs(`watt.${prefix}`, translation)
      .filter(({ key }) => !this.hasTranslation(key, lang))
      .forEach(({ key, value }) =>
        this.transloco.setTranslationKey(key, value, lang, {
          emitChange: false,
        })
      );
  }

  /** Gets the translated value of a key. */
  translate(key: string) {
    return this.transloco.translate(`watt.${key}`);
  }
}
