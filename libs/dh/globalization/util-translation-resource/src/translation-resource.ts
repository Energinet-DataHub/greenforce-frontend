import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

import { TranslationScopeMap } from '@energinet-datahub/dh/shared/domain/i18n/types';

export function translationResource<K extends keyof TranslationScopeMap>(scope: K) {
  const service = inject(TranslocoService);
  return rxResource<TranslationScopeMap[K], unknown>({
    stream: () => service.selectTranslateObject<TranslationScopeMap[K]>(scope as string),
  });
}
