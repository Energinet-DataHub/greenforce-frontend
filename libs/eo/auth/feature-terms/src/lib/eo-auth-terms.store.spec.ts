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
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { EoAuthTermsStore } from './eo-auth-terms.store';
import { of, firstValueFrom } from 'rxjs';

 describe(EoAuthTermsStore.name, () => {
  describe('Given the Auth API is available', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          EoAuthTermsStore,
          MockProvider(AuthHttp, {
            getTerms: (endpointUrl) => of({terms, version, headline }),
            postAcceptTerms: (endpointUrl, payload) => of({next_url: 'https://domain.com'})
          }),
        ],
      });
      store = TestBed.inject(EoAuthTermsStore);
    });

    const terms = '<p>Terms comes here</p>';
    const version = '1.0';
    const headline = 'Read the terms';
    let store: EoAuthTermsStore;

    it('Then the terms are emitted', async () => {
      const terms = await firstValueFrom(store.terms$);
      expect(terms).toBe(terms);
    });

    it('Then the headline is emitted', async () => {
      const headline = await firstValueFrom(store.headline$);
      expect(headline).toBe(headline);
    });

    it('Then the "next_url" is received after accepting the terms', async () => {

      // Accept the terms
      // store.onAcceptTerms();

      // Expect a redirect -> Shouldn't this test just be handled inside an end-to-end test with cypress?
      // ..
    });

  });
});
