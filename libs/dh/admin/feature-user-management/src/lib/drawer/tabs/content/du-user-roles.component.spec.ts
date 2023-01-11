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
          active: true,
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
