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
            getTerms: (endpointUrl) =>
              of({terms: '<p>Terms comes here</p>', version: '1.0', headline: 'Read the terms'})
          }),
        ],
      });
      store = TestBed.inject(EoAuthTermsStore);
    });

    let store: EoAuthTermsStore;

    it('Then the terms are emitted', async () => {
      const terms = await firstValueFrom(store.terms$);
      expect(terms).toBe('<p>Terms comes here</p>');
    });

    it('Then the headline is emitted', async () => {
      const headline = await firstValueFrom(store.headline$);
      expect(headline).toBe('Read the terms');
    });
  });
});
