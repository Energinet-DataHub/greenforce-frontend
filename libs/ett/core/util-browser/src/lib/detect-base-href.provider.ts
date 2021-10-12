import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { FactoryProvider } from '@angular/core';

/**
 * Provide document base href value as `APP_BASE_HREF`.
 */
export const detectBaseHrefProvider: FactoryProvider = {
  deps: [DOCUMENT],
  provide: APP_BASE_HREF,
  useFactory: (document: Document): string => document.baseURI,
};
