import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ResourceRef } from '@angular/core';
import { map } from 'rxjs';
import { TranslocoService, TRANSLOCO_SCOPE, toCamelCase } from '@jsverse/transloco';
import { TranslationScopeMap } from '@energinet-datahub/dh/globalization/domain';

export function i18nResource<
  S extends keyof TranslationScopeMap,
  P extends string & keyof TranslationScopeMap[S],
>(
  scope: S,
  prefix: P,
  params?: () => Record<string, unknown>
): ResourceRef<TranslationScopeMap[S][P] | undefined>;

export function i18nResource<S extends keyof TranslationScopeMap>(
  scope: S,
  params?: () => Record<string, unknown>
): ResourceRef<TranslationScopeMap[S] | undefined>;

export function i18nResource(
  scope: keyof TranslationScopeMap,
  prefixOrParams?: string | (() => Record<string, unknown>),
  params?: () => Record<string, unknown>
) {
  const service = inject(TranslocoService);
  const providerScope = inject(TRANSLOCO_SCOPE);
  const resolvedParams = typeof prefixOrParams === 'string' ? params : prefixOrParams;
  const resolvedKey =
    typeof prefixOrParams === 'string'
      ? `${toCamelCase(scope)}.${prefixOrParams}`
      : toCamelCase(scope);

  return rxResource({
    params: resolvedParams,
    stream: ({ params }) =>
      service
        .selectTranslate('', {}, providerScope)
        .pipe(map(() => service.translateObject(resolvedKey, params))),
  });
}
