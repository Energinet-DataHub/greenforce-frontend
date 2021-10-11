import { APP_BASE_HREF, ɵgetDOM as getDOM } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { EttBrowserConfigurationModule } from './ett-browser-configuration.module';

function getDocument(): Document {
  return getDOM().getDefaultDocument();
}

describe(EttBrowserConfigurationModule.name, () => {
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
      const doc = getDocument();
      Object.defineProperty(doc, 'baseURI', {
        get(): string {
          return expectedBaseHref;
        },
      });

      TestBed.configureTestingModule({
        imports: [EttBrowserConfigurationModule],
      });

      const actualBaseHref = TestBed.inject(APP_BASE_HREF);
      expect(actualBaseHref).toBe(expectedBaseHref);
    });
  });
});
