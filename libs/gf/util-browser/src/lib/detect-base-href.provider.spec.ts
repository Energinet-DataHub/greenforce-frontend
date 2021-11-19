/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
    'https://localhost',
    'https://localhost/',
    'https://localhost/app',
    'https://localhost/app/',
    'https://localhost:5001',
    'https://localhost:5001/',
    'https://localhost:5001/app',
    'https://localhost:5001/app/',
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
