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
import { render } from '@testing-library/angular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { MsalServiceFake } from '@energinet-datahub/dh/shared/test-util-auth';

import { DataHubAppComponent } from './datahub-app.component';
import { DataHubAppModule } from './datahub-app.module';

describe('Application smoke test', () => {
  it('navigation works', async () => {
    const { navigate } = await render(DataHubAppComponent, {
      imports: [getTranslocoTestingModule(), DataHubAppModule],
      providers: [MsalServiceFake],
    });

    const didNavigationSucceed = await navigate('/');

    await expect(didNavigationSucceed).toBe(true);
  });
});
