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

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { of } from 'rxjs';
import { Router } from '@angular/router';

import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import { WattModalService } from '@energinet/watt/modal';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhMeteringPointProcessOverviewDetails } from '../src/components/details/details';

async function setup(
  processId = 'process-eos-cancel',
  permissionOverrides: { isFas?: boolean } = {}
) {
  const { isFas = false } = permissionOverrides;
  const { fixture } = await render(DhMeteringPointProcessOverviewDetails, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      WattModalService,
      DhNavigationService,
      { provide: ComponentFixtureAutoDetect, useValue: true },
      {
        provide: PermissionService,
        useValue: {
          isFas: () => of(isFas),
          hasMarketRole: () => of(true),
          hasPermission: () => of(true),
        },
      },
    ],
    imports: [getTranslocoTestingModule()],
    componentInputs: {
      id: processId,
      meteringPointId: 'mp-123',
      internalMeteringPointId: 'imp-123',
    },
  });

  await waitForAsync(() => expect(document.querySelector('watt-drawer')).not.toBeNull());

  return fixture;
}

describe('Process overview details', () => {
  it('should render the drawer', async () => {
    await setup();
    expect(document.querySelector('watt-drawer')).toBeInTheDocument();
  });

  it('should show a state badge', async () => {
    await setup();
    expect(document.querySelector('dh-state-badge')).not.toBeNull();
  });

  it('should display process steps', async () => {
    await setup();
    expect(document.querySelector('dh-metering-point-process-overview-steps')).not.toBeNull();
  });

  it('should show action buttons for EndOfSupply process', async () => {
    await setup('process-eos-cancel');
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
  });

  it('should show reject request button for EndOfSupply process', async () => {
    await setup('process-eos-cancel');
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Reject request/i }).length).toBeGreaterThan(0)
    );
  });

  it('should show request disconnection button for EndOfSupply process', async () => {
    await setup('process-eos-cancel');
    await waitForAsync(() =>
      expect(
        screen.getAllByRole('button', { name: /Request disconnection/i }).length
      ).toBeGreaterThan(0)
    );
  });

  it('should open disconnect modal when request disconnection is clicked', async () => {
    await setup('process-eos-cancel');
    await waitForAsync(() =>
      expect(
        screen.getAllByRole('button', { name: /Request disconnection/i }).length
      ).toBeGreaterThan(0)
    );
    const [disconnectButton] = screen.getAllByRole('button', {
      name: /Request disconnection/i,
    });

    userEvent.click(disconnectButton);

    await waitForAsync(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Validity date/i)).toBeInTheDocument();
  });

  it('should show send information button for CustomerMoveIn process', async () => {
    await setup('process-cmi-info');
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Send information/i }).length).toBeGreaterThan(0)
    );
  });

  it('should navigate with internalMeteringPointId when Send information is clicked', async () => {
    const fixture = await setup('process-cmi-info');
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
        'imp-123',
        'update-customer-details',
        expect.any(String),
      ])
    );
  });

  it('should show initiator in description list', async () => {
    await setup();
    const terms = screen.getAllByRole('term');
    expect(terms.some((term) => /Initiating participant/i.test(term.textContent || ''))).toBe(true);
  });

  it.each([
    ['process-eos-cancel', /Cancel|Reject request|Request disconnection/i],
    ['process-eos-request-service', /Request service/i],
  ])('should disable action buttons for FAS users (%s)', async (processId, buttonPattern) => {
    await setup(processId, { isFas: true });
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: buttonPattern }).length).toBeGreaterThan(0)
    );
    const actionButtons = screen.getAllByRole('button', { name: buttonPattern });
    actionButtons.forEach((button) => {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });
});
