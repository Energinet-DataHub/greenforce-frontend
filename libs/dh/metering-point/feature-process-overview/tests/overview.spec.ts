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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import { WattModalService } from '@energinet/watt/modal';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { DhMeteringPointProcessOverviewTable } from '../src/components/overview';

async function setup(
  overrides: Partial<{
    isFas: boolean;
    actorMarketRole: EicFunction;
    isEnergySupplierResponsible: boolean;
  }> = {}
) {
  const {
    isFas = false,
    actorMarketRole = EicFunction.GridAccessProvider,
    isEnergySupplierResponsible = false,
  } = overrides;

  const { fixture } = await render(DhMeteringPointProcessOverviewTable, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      WattModalService,
      { provide: ComponentFixtureAutoDetect, useValue: true },
      {
        provide: PermissionService,
        useValue: {
          isFas: () => of(isFas),
          hasPermission: () => of(true),
        },
      },
      {
        provide: DhActorStorage,
        useValue: {
          getSelectedActor: () => ({
            id: 'actor-1',
            gln: '1234567890123',
            marketRole: actorMarketRole,
            actorName: 'Test Actor',
            organizationName: 'Test Org',
            displayName: 'Test Actor Display',
          }),
        },
      },
    ],
    imports: [getTranslocoTestingModule()],
    componentInputs: {
      meteringPointId: 'mp-123',
      internalMeteringPointId: 'imp-456',
      isEnergySupplierResponsible,
    },
  });

  await waitForAsync(() =>
    expect(document.querySelector('[role="treegrid"] [role="gridcell"]')).not.toBeNull()
  );

  return fixture;
}

describe('Process overview', () => {
  it('should render the table with process data', async () => {
    await setup();
    expect(screen.getByRole('treegrid')).toBeInTheDocument();
  });

  it('should show the date range filter', async () => {
    await setup();
    expect(document.querySelector('watt-date-range-chip')).not.toBeNull();
  });

  it('should show cancel button and open modal when clicked', async () => {
    await setup();

    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
    const cancelButtons = screen.getAllByRole('button', { name: /Cancel/i });

    userEvent.click(cancelButtons[0]);

    await waitForAsync(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    await waitForAsync(() => {
      const buttons = Array.from(document.querySelectorAll('[role="dialog"] button'));
      expect(buttons.some((b) => /sure/i.test(b.textContent || ''))).toBe(true);
    });
  });

  it('should show send information button and navigate when clicked', async () => {
    const fixture = await setup();
    const router = fixture.debugElement.injector.get(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Send information/i }).length).toBeGreaterThan(0)
    );
    const sendInfoButtons = screen.getAllByRole('button', { name: /Send information/i });

    userEvent.click(sendInfoButtons[0]);

    await waitForAsync(() =>
      expect(router.navigate).toHaveBeenCalledWith([
        'metering-point',
        'imp-456',
        'update-customer-details',
        expect.any(String),
      ])
    );
  });

  it('should not show action buttons when user has no relevant market role', async () => {
    await setup({ actorMarketRole: EicFunction.DataHubAdministrator });
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Send information/i })).toHaveLength(0);
  });

  it('should show warning text instead of buttons for FAS users', async () => {
    await setup({ isFas: true, actorMarketRole: EicFunction.DataHubAdministrator });
    await waitForAsync(() =>
      expect(screen.getAllByText(/can cancel workflow/i).length).toBeGreaterThan(0)
    );
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
  });

  it('should show action buttons for responsible EnergySupplier', async () => {
    await setup({
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: true,
    });
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
  });

  it('should hide all actions for non-responsible EnergySupplier', async () => {
    await setup({
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: false,
    });
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Send information/i })).toHaveLength(0);
    expect(screen.queryAllByText(/can cancel workflow/i)).toHaveLength(0);
  });

  it('should not show FAS warning text for non-responsible EnergySupplier even if FAS', async () => {
    await setup({
      isFas: true,
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: false,
    });
    expect(screen.queryAllByText(/can cancel workflow/i)).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
  });

  it('should still show action buttons for GridAccessProvider regardless of responsibility', async () => {
    await setup({
      actorMarketRole: EicFunction.GridAccessProvider,
      isEnergySupplierResponsible: false,
    });
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
  });
});
