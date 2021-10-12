import { APP_BASE_HREF, ɵgetDOM as getDOM } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { detectBaseHrefProvider } from './detect-base-href.provider';

/**
 * @returns The `Document` used by the active Angular `DomAdapter`.
 */
function getDocument(): Document {
  return getDOM().getDefaultDocument();
}

/**
 * Override `Document#baseURI` with the specified base URI.
 */
function setBaseUri(baseUri: string): void {
  const doc = getDOM().getDefaultDocument();

  Object.defineProperty(doc, 'baseURI', {
    get(): string {
      return baseUri;
    },
  });
}

describe('detectBaseHrefProvider', () => {
  beforeEach(() => {
    realBaseUri = getDocument().baseURI;
  });

  afterEach(() => {
    setBaseUri(realBaseUri);
  });

  let realBaseUri: string;

  [
    'https://example.com',
    'https://example.com/',
    'https://example.com/app',
    'https://example.com/app/',
    'http://localhost',
    'http://localhost/',
    'http://localhost/app',
    'http://localhost/app/',
    'http://localhost:4200',
    'http://localhost:4200/',
    'http://localhost:4200/app',
    'http://localhost:4200/app/',
  ].forEach((expectedBaseHref) => {
    it(`provides the document's base URI "${expectedBaseHref}" as APP_BASE_HREF`, () => {
      setBaseUri(expectedBaseHref);

      TestBed.configureTestingModule({
        providers: [detectBaseHrefProvider],
      });

      const actualBaseHref = TestBed.inject(APP_BASE_HREF);
      expect(actualBaseHref).toBe(expectedBaseHref);
    });
  });
});
