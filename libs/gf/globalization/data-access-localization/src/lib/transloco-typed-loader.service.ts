import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable, from, of } from 'rxjs';

export const TRANSLOCO_TYPED_TRANSLATION_PATH = new InjectionToken<string>(
  'TRANSLOCO_TYPED_TRANSLATION_PATH'
);

@Injectable()
export class TranslocoTypedLoader implements TranslocoLoader {
  constructor(
    @Inject(TRANSLOCO_TYPED_TRANSLATION_PATH)
    private path: Record<string, (() => Promise<Translation>) | Translation>
  ) {}

  getTranslation(lang: string): Observable<Translation> {
    if (!this.path[lang]) {
      return from(Promise.resolve({}));
    }

    if (typeof this.path[lang] === 'object') {
      return of(this.path[lang]);
    }

    const translations: Promise<Translation> = this.path[lang]().then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: any) => m[`${lang.toUpperCase()}_TRANSLATIONS`]
    );
    return from(translations);
  }
}
