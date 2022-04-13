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
import { AuthHttp } from '@energinet-datahub/eo/auth/data-access-api';
import { EoPrivacyPolicyStore } from './eo-privacy-policy.store';
import { firstValueFrom, of } from 'rxjs';

describe(EoPrivacyPolicyStore.name, () => {
  describe('Given the Auth API is available', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          EoPrivacyPolicyStore,
          MockProvider(AuthHttp, {
            getTerms: () => of({ terms, version, headline: 'Privacy Policy' }),
          }),
        ],
      });
      store = TestBed.inject(EoPrivacyPolicyStore);
    });

    const terms = '<p>Terms comes here</p>';
    const version = '1.0';
    let store: EoPrivacyPolicyStore;

    it('Then the privacy policy is emitted', async () => {
      const terms = await firstValueFrom(store.privacyPolicy$);
      expect(terms).toBe(terms);
    });

    it('Then the version is emitted', async () => {
      const version = await firstValueFrom(store.version$);
      expect(version).toBe(version);
    });
  });
});
