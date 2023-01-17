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
import { render, screen, waitFor } from '@testing-library/angular';
import { DhAdminUserRolesStore } from '@energinet-datahub/dh/admin/data-access-api';
import { DhUserRolesComponent } from './dh-user-roles.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { HttpClientModule } from '@angular/common/http';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';

describe('UserRolesComponent', () => {
  async function setup() {
    const { fixture } = await render(DhUserRolesComponent, {
      componentProperties: {
        user: {
          id: '47a76eb8-3814-4bc1-96a9-a9a5b9adf843',
          email: 'fake@value',
          status: 'Active',
          createdDate: '2023-01-10T10:12:06+00:00',
          name: 'fake value',
        },
      },
      componentProviders: [
        {
          provide: DhAdminUserRolesStore,
        },
      ],
      imports: [
        getTranslocoTestingModule(),
        HttpClientModule,
        DhApiModule.forRoot(),
      ],
    });

    return { fixture };
  }

  test('should render 3 roles', async () => {
    await setup();
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /3 roles/i })
      ).toBeInTheDocument();
    });
  });
});
