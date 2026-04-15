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

import { of } from 'rxjs';

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

async function setup(processId = 'process-eos-cancel', permissionOverrides: { isFas?: boolean } = {}) {
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

  it('should show send information button for CustomerMoveIn process', async () => {
    await setup('process-cmi-info');
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Send information/i }).length).toBeGreaterThan(0)
    );
  });

  it('should show initiator in description list', async () => {
    await setup();
    const terms = screen.getAllByRole('term');
    expect(terms.some((term) => /Initiating participant/i.test(term.textContent || ''))).toBe(true);
  });

  it('should disable action buttons for FAS users', async () => {
    await setup('process-eos-cancel', { isFas: true });
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
    const actionButtons = screen.getAllByRole('button', { name: /Cancel|Reject request/i });
    actionButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
