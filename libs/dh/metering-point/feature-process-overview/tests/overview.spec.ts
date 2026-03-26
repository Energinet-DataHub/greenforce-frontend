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
import { vi } from 'vitest';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import { WattModalService } from '@energinet/watt/modal';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { DhMeteringPointProcessOverviewTable } from '../src/components/overview';

async function setup(
  permissionOverrides: Partial<{
    isFas: boolean;
    hasMarketRole: boolean;
  }> = {}
) {
  const { isFas = false, hasMarketRole = true } = permissionOverrides;

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
          hasMarketRole: () => of(hasMarketRole),
          hasPermission: () => of(true),
        },
      },
    ],
    imports: [getTranslocoTestingModule()],
    componentInputs: {
      meteringPointId: 'mp-123',
      internalMeteringPointId: 'imp-456',
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

    await waitForAsync(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
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

    expect(router.navigate).toHaveBeenCalledWith([
      'metering-point',
      'imp-456',
      'update-customer-details',
      expect.any(String),
    ]);
  });

  it('should not show action buttons when user has no market role', async () => {
    await setup({ hasMarketRole: false });
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Send information/i })).toHaveLength(0);
  });

  it('should show warning text instead of buttons for FAS users', async () => {
    await setup({ isFas: true, hasMarketRole: false });
    await waitForAsync(() =>
      expect(screen.getAllByText(/can cancel workflow/i).length).toBeGreaterThan(0)
    );
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
  });
});
