//#region License
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
//#endregion
import { of } from 'rxjs';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattModalService } from '@energinet/watt/modal';

import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { Permission } from '@energinet-datahub/dh/shared/domain';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { DhReleaseToggleService } from '@energinet-datahub/dh/shared/util-release-toggle';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util';

import { DhServiceRequestModal } from '@energinet-datahub/dh/metering-point/feature-process-overview';

import { DhMeteringPointActionsComponent } from '../src/components/dh-metering-point-actions.component';

const meteringPointId = 'mp-039';
const internalMeteringPointId = 'imp-039';

type SetupOptions = {
  hasServiceRequestPermission?: boolean;
  serviceRequestFlagEnabled?: boolean;
  isEnergySupplierResponsible?: boolean;
};

async function setup({
  hasServiceRequestPermission = true,
  serviceRequestFlagEnabled = true,
  isEnergySupplierResponsible = true,
}: SetupOptions = {}) {
  const open = vi.fn();

  await render(DhMeteringPointActionsComponent, {
    inputs: {
      meteringPointId,
      internalMeteringPointId,
      isEnergySupplierResponsible,
      searchMigratedMeteringPoints: false,
    },
    providers: [
      { provide: WattModalService, useValue: { open } },
      {
        provide: DhFeatureFlagsService,
        useValue: {
          isEnabled: (flag?: string) =>
            flag === 'service-request' ? serviceRequestFlagEnabled : false,
        },
      },
      { provide: DhReleaseToggleService, useValue: { isEnabled: () => false } },
      {
        provide: PermissionService,
        useValue: {
          hasPermission: (permission: Permission) =>
            of(
              permission === 'metering-point:service-request-request'
                ? hasServiceRequestPermission
                : false
            ),
          hasMarketRole: () => of(false),
        },
      },
      {
        provide: DhActorStorage,
        useValue: {
          getSelectedActor: () => ({
            gln: '1234567890123',
            marketRole: EicFunction.EnergySupplier,
          }),
        },
      },
    ],
    imports: [getTranslocoTestingModule()],
  });

  const user = userEvent.setup();
  return { open, user };
}

async function openActionsMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: /actions/i }));
}

describe(DhMeteringPointActionsComponent, () => {
  it('shows the request service action when the user has the permission, the flag is on and is the responsible supplier', async () => {
    const { user } = await setup();

    await openActionsMenu(user);

    expect(
      await screen.findByRole('menuitem', { name: /request service/i })
    ).toBeInTheDocument();
  });

  it('hides the request service action when the user lacks the permission', async () => {
    const { user } = await setup({ hasServiceRequestPermission: false });

    await openActionsMenu(user);

    // Positive control: the menu is open (the responsible supplier still sees the
    // customer-data action), so the request service item is genuinely absent.
    expect(await screen.findByRole('menuitem', { name: /update customer data/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /request service/i })).not.toBeInTheDocument();
  });

  it('hides the request service action when the feature flag is off', async () => {
    const { user } = await setup({ serviceRequestFlagEnabled: false });

    await openActionsMenu(user);

    expect(await screen.findByRole('menuitem', { name: /update customer data/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /request service/i })).not.toBeInTheDocument();
  });

  it('opens the service request modal with the metering point id and a process id', async () => {
    const { open, user } = await setup();

    await openActionsMenu(user);
    await user.click(await screen.findByRole('menuitem', { name: /request service/i }));

    expect(open).toHaveBeenCalledWith(
      expect.objectContaining({
        component: DhServiceRequestModal,
        data: expect.objectContaining({
          meteringPointId,
          processId: expect.any(String),
        }),
      })
    );
  });
});
