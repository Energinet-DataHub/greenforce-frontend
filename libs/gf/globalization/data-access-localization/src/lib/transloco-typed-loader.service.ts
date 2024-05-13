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
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable, from, of } from 'rxjs';

export const TRANSLOCO_TYPED_TRANSLATION_PATH = new InjectionToken<string>(
  'TRANSLOCO_TYPED_TRANSLATION_PATH'
);

@Injectable()
export class TranslocoTypedLoader implements TranslocoLoader {
  constructor(
    @Inject(TRANSLOCO_TYPED_TRANSLATION_PATH) private path: Record<string, () => Promise<Translation> | Translation>
  ) {}

  getTranslation(lang: string): Observable<Translation> {
    if(!this.path[lang]) {
      return from(Promise.resolve({}));
    }

    if(typeof this.path[lang] === 'object') {
      return of(this.path[lang]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translations: Promise<Translation> = this.path[lang]().then((m: any) => m[`${lang.toUpperCase()}_TRANSLATIONS`]);
    return from(translations);
  }
}
