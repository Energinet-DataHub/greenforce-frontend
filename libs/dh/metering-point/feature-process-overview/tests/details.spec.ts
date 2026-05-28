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
import { Clipboard } from '@angular/cdk/clipboard';

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { of } from 'rxjs';
import { Router } from '@angular/router';

import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { processCmiInfoInitiatorGln } from '@energinet-datahub/dh/shared/test-util-mocks';
import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import { WattModalService } from '@energinet/watt/modal';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhMeteringPointProcessOverviewDetails } from '../src/components/details/details';

// Mirrors the canonical permission-to-role mapping in
// geh-market-participant/.../KnownPermissions.cs so role-only handlers gate
// realistically in tests (instead of an all-true mock making the assertions
// vacuous).
const PERMISSIONS_BY_ROLE: Partial<Record<EicFunction, ReadonlySet<string>>> = {
  [EicFunction.EnergySupplier]: new Set([
    'metering-point:end-of-supply-request',
    'metering-point:connection-state-manage',
    'metering-point:move-in',
    'metering-point:change-of-supplier',
  ]),
  [EicFunction.GridAccessProvider]: new Set([
    'metering-point:end-of-supply-respond',
    'metering-point:connection-state-manage',
  ]),
};

async function setup(
  processId = 'process-eos-cancel',
  overrides: {
    isFas?: boolean;
    actorMarketRole?: EicFunction;
    actorGln?: string;
    isEnergySupplierResponsible?: boolean;
  } = {}
) {
  const {
    isFas = false,
    actorMarketRole = EicFunction.GridAccessProvider,
    actorGln = '1234567890123',
    isEnergySupplierResponsible = false,
  } = overrides;
  const rolePermissions = PERMISSIONS_BY_ROLE[actorMarketRole] ?? new Set<string>();
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
          hasPermission: (permission: string) => of(rolePermissions.has(permission)),
        },
      },
      {
        provide: DhActorStorage,
        useValue: {
          getSelectedActor: () => ({
            id: 'actor-1',
            gln: actorGln,
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
      id: processId,
      meteringPointId: 'mp-123',
      internalMeteringPointId: 'imp-123',
      isEnergySupplierResponsible,
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

  it('should show reject request button for GridAccessProvider on EndOfSupply process', async () => {
    await setup('process-eos-cancel');
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Reject request/i }).length).toBeGreaterThan(0)
    );
  });

  it('should hide cancel button for GridAccessProvider on EndOfSupply process', async () => {
    await setup('process-eos-cancel');
    // Confirm at least one EndOfSupply action has rendered so the assertion
    // below cannot pass simply because the actions row has not loaded yet.
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Reject request/i }).length).toBeGreaterThan(0)
    );
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
  });

  it('should hide reject request button for responsible EnergySupplier on EndOfSupply process', async () => {
    await setup('process-eos-cancel', {
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: true,
    });
    // Positive control: cancel must render so the negation below proves the
    // role gate, not just an unloaded actions row.
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
    expect(screen.queryAllByRole('button', { name: /Reject request/i })).toHaveLength(0);
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
    const user = userEvent.setup();
    await waitForAsync(() =>
      expect(
        screen.getAllByRole('button', { name: /Request disconnection/i }).length
      ).toBeGreaterThan(0)
    );
    const [disconnectButton] = screen.getAllByRole('button', {
      name: /Request disconnection/i,
    });

    await user.click(disconnectButton);

    await waitForAsync(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Validity date/i)).toBeInTheDocument();
  });

  it('should close disconnect modal after submitting', async () => {
    await setup('process-eos-cancel');
    const user = userEvent.setup();
    await waitForAsync(() =>
      expect(
        screen.getAllByRole('button', { name: /Request disconnection/i }).length
      ).toBeGreaterThan(0)
    );
    const [disconnectButton] = screen.getAllByRole('button', {
      name: /Request disconnection/i,
    });
    await user.click(disconnectButton);
    await waitForAsync(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const dialog = screen.getByRole('dialog');
    const confirmButton = within(dialog).getByRole('button', {
      name: /Request disconnection/i,
    });
    await user.click(confirmButton);

    await waitForAsync(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('should show send information button for CustomerMoveIn process', async () => {
    await setup('process-cmi-info');
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Send information/i }).length).toBeGreaterThan(0)
    );
  });

  it('should navigate with internalMeteringPointId when Send information is clicked', async () => {
    const fixture = await setup('process-cmi-info');
    const user = userEvent.setup();
    const router = fixture.debugElement.injector.get(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Send information/i }).length).toBeGreaterThan(0)
    );
    const sendInfoButtons = screen.getAllByRole('button', { name: /Send information/i });

    await user.click(sendInfoButtons[0]);

    await waitForAsync(() =>
      expect(router.navigate).toHaveBeenCalledWith(
        ['metering-point', 'imp-123', 'update-customer-details', expect.any(String)],
        expect.objectContaining({ queryParams: expect.any(Object) })
      )
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
  ])(
    'should expose grouped actions that open an info modal when clicked for FAS users (%s)',
    async (processId, buttonPattern) => {
      await setup(processId, { isFas: true });
      const user = userEvent.setup();

      // The "Show possible actions" expandable must be present for FAS users.
      const expander = await screen.findByRole('button', { name: /Show possible actions/i });
      const regionId = expander.getAttribute('aria-controls');
      const region = regionId ? document.getElementById(regionId) : null;
      if (!region) throw new Error('expandable region not found');

      // When collapsed, the expandable region carries inert so the action
      // buttons inside it are removed from the tab order and a11y tree at the
      // browser level. jsdom does not enforce inert during role queries, so
      // assert two structural invariants instead: the region has inert, and
      // every button matching the action pattern lives inside that region
      // (i.e. cannot be reached outside the inert subtree).
      expect(region).toHaveAttribute('inert');
      screen
        .queryAllByRole('button', { name: buttonPattern })
        .forEach((button) => expect(region.contains(button)).toBe(true));

      await user.click(expander);

      // Once expanded, inert is removed and the action buttons render as
      // live (not disabled) buttons. Clicking one opens an informational
      // modal explaining that only the actor can perform the action.
      await waitForAsync(() => expect(region).not.toHaveAttribute('inert'));
      const actionButtons = screen.getAllByRole('button', { name: buttonPattern });
      expect(actionButtons.length).toBeGreaterThan(0);
      actionButtons.forEach((button) => {
        expect((button as HTMLButtonElement).disabled).toBe(false);
      });

      await user.click(actionButtons[0]);

      await waitForAsync(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByRole('paragraph')).toHaveTextContent(
        /only the actor itself can perform this action/i
      );

      const understoodButton = within(dialog).getByRole('button', { name: /Understood/i });
      await user.click(understoodButton);

      await waitForAsync(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    }
  );

  it('should hide all action buttons for non-responsible EnergySupplier', async () => {
    await setup('process-eos-cancel', {
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: false,
    });

    expect(document.querySelector('watt-description-list')).not.toBeNull();

    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Reject request/i })).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Request disconnection/i })).toHaveLength(0);
  });

  it('should show CustomerMoveIn.SendInformation for initiating participant', async () => {
    await setup('process-cmi-info', {
      actorMarketRole: EicFunction.EnergySupplier,
      actorGln: processCmiInfoInitiatorGln,
    });

    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Send information/i }).length).toBeGreaterThan(0)
    );
  });

  it('should hide CustomerMoveIn.SendInformation when actor is not the initiating participant', async () => {
    await setup('process-cmi-info', {
      actorMarketRole: EicFunction.EnergySupplier,
      actorGln: '1234567890123',
    });

    expect(document.querySelector('watt-description-list')).not.toBeNull();
    expect(screen.queryAllByRole('button', { name: /Send information/i })).toHaveLength(0);
  });

  it('should show action buttons for responsible EnergySupplier', async () => {
    await setup('process-eos-cancel', {
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: true,
    });
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
  });

  it('should copy the process id to the clipboard when the copy link is clicked', async () => {
    const fixture = await setup('process-copy-test-id');
    const user = userEvent.setup();
    const clipboard = fixture.debugElement.injector.get(Clipboard);
    const copySpy = vi.spyOn(clipboard, 'copy').mockReturnValue(true);

    const copyLink = await screen.findByRole('button', { name: /copy/i });
    await user.click(copyLink);

    expect(copySpy).toHaveBeenCalledWith('process-copy-test-id');
  });
});
