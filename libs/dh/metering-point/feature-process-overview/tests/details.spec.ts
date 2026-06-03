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
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Clipboard } from '@angular/cdk/clipboard';

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
import { EicFunction, MeteringPointProcessState } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhMeteringPointProcessOverviewDetails } from '../src/components/details/details';
import { DhMeteringPointProcessOverviewStore } from '../src/components/metering-point-process-overview.store';

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
  const { fixture } = await render(DhMeteringPointProcessOverviewDetails, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      WattModalService,
      DhNavigationService,
      // The store reads `meteringPointId` from inherited route data and fires the
      // overview query; the drawer uses the resulting visible list to decide
      // link-vs-text in the cross-cancellation banner.
      DhMeteringPointProcessOverviewStore,
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
            gln: actorGln,
            marketRole: actorMarketRole,
            actorName: 'Test Actor',
            organizationName: 'Test Org',
            displayName: 'Test Actor Display',
          }),
        },
      },
    ],
    // Stub ActivatedRoute (overridden AFTER the module-level `provideRouter([])`
    // appended by the shared testbed) for the co-injected DhNavigationService;
    // `children`/`firstChild` mirror an empty root route.
    configureTestBed: (testBed) =>
      testBed.overrideProvider(ActivatedRoute, {
        useValue: { data: of({}), children: [], firstChild: null },
      }),
    imports: [getTranslocoTestingModule()],
    componentInputs: {
      id: processId,
      meteringPointId: 'mp-123',
      internalMeteringPointId: 'imp-123',
      isEnergySupplierResponsible,
    },
  });

  // The drawer is rendered in isolation, so play the overview's role: feed the
  // metering point id into the store that owns the overview query (the overview
  // does this from its route-bound input in the real app).
  fixture.debugElement.injector
    .get(DhMeteringPointProcessOverviewStore)
    .meteringPointId.set('mp-123');

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

  it('should show the initiator GLN/name when the initiator is not masked', async () => {
    // `process-eos-cancel`'s initiator resolves to the logged-in actor's GLN
    // (1234567890123 • Radius), so the description list shows the displayName.
    await setup('process-eos-cancel');

    const definitions = await screen.findAllByRole('definition');
    expect(definitions.some((d) => /1234567890123/.test(d.textContent || ''))).toBe(true);
  });

  it('should show only the translated role when the initiator is masked', async () => {
    // `process-masked-initiator` has a null resolved participant but an
    // initiatorRole of GridAccessProvider, so the description list falls back to
    // the translated role ("Grid access provider") and never reveals a GLN.
    await setup('process-masked-initiator');

    const definitions = await screen.findAllByRole('definition');
    const initiatorDefinition = definitions.find((d) =>
      /Grid access provider/i.test(d.textContent || '')
    );
    expect(initiatorDefinition).toBeTruthy();

    // No GLN-style 13-digit number is rendered for the masked initiator.
    expect(initiatorDefinition?.textContent ?? '').not.toMatch(/\d{13}/);
  });

  it('should show the actor GLN/name for a resolved step actor and the role for a masked one', async () => {
    // `process-masked-initiator` (EndOfSupply) has two steps: step 1 with a
    // resolved actor (GLN shown) and step 2 with a null actor but a SystemOperator
    // role (translated role shown instead). Both labels are unique to the steps
    // table in this drawer, so a global text query is unambiguous.
    await setup('process-masked-initiator');

    // Resolved actor: the step renders the GLN/name from displayName.
    await waitForAsync(() =>
      expect(screen.getByText(/1234567890123 • Radius/)).toBeInTheDocument()
    );

    // Masked actor: the step renders the translated role, not a GLN.
    expect(screen.getByText(/System operator/i)).toBeInTheDocument();
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

    await waitForAsync(() => expect(document.querySelector('watt-drawer-actions')).not.toBeNull());

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

    await waitForAsync(() => expect(document.querySelector('watt-drawer-actions')).not.toBeNull());
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

  it('should show the cross-cancellation banner when the process was cancelled by another process', async () => {
    // `process-cross-cancelled` carries a resolved `cancelledByProcess` object that
    // gates the banner. The cancelling process (`process-cancelling`) is present in
    // the overview list, so the process name renders as a clickable link.
    const fixture = await setup('process-cross-cancelled');

    const banner = await screen.findByRole('note');
    expect(banner).toHaveTextContent(/Process cancelled by/i);
    expect(banner).toHaveTextContent(/with cut-off date/i);

    // Wait until the overview query has resolved and the cancelling process id is in the
    // visible list. Only then is the link's presence meaningful: it proves the link was
    // chosen because the store gates it, not because the template hardcodes a link (which
    // would make the assertion pass even if the store check were removed). Mirrors the
    // guard in the plain-text test below.
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);
    await waitForAsync(() =>
      expect(store.visibleProcessIds().has('process-cancelling')).toBe(true)
    );

    // The cancelling process is rendered as a clickable link labelled with its
    // translated process type (SecondaryMoveIn -> "Secondary move-in (BRS-009)").
    await waitForAsync(() =>
      expect(within(banner).getByRole('button', { name: /Secondary move-in/i })).toBeInTheDocument()
    );
  });

  it('should render the cancelling process as plain text when it is not in the overview list', async () => {
    // The cancelling process (`process-cancelling-not-listed`) is not part of the
    // overview's visible list, so the banner still shows the wording but the
    // process name is plain text, not a link.
    const fixture = await setup('process-cross-cancelled-not-listed');

    const banner = await screen.findByRole('note');
    expect(banner).toHaveTextContent(/Process cancelled by/i);
    expect(banner).toHaveTextContent(/Secondary move-in/i);
    expect(banner).toHaveTextContent(/with cut-off date/i);

    // Wait until the overview query has actually resolved and populated the visible
    // list (it contains `process-cancelling`). Only then is "no link" meaningful: it
    // proves the plain-text branch was chosen because this id is absent, not because
    // the list had not loaded yet (which would make the assertion a timing tautology).
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);
    await waitForAsync(() =>
      expect(store.visibleProcessIds().has('process-cancelling')).toBe(true)
    );

    // No link/button to the cancelling process is rendered, and the name is plain text.
    expect(
      within(banner).queryByRole('button', { name: /Secondary move-in/i })
    ).not.toBeInTheDocument();
    expect(within(banner).getByText(/Secondary move-in/i).tagName).toBe('SPAN');
  });

  it('downgrades the cancelling-process link to plain text when a filter hides it from the table', async () => {
    // process-cross-cancelled is cancelled by process-cancelling (SecondaryMoveIn / Running),
    // which IS loaded, so with no filter the banner renders a link (asserted as the
    // precondition below). Once a status filter that excludes Running is applied,
    // process-cancelling leaves the visible table, so the banner must downgrade to plain
    // text: the overview cannot mark a row it no longer renders, so a link there would
    // navigate to a process with no row to highlight (issue 1549's filter edge case).
    const fixture = await setup('process-cross-cancelled');
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);

    const banner = await screen.findByRole('note');

    // Precondition: with no filter the cancelling process is visible and renders as a link.
    await waitForAsync(() =>
      expect(store.visibleProcessIds().has('process-cancelling')).toBe(true)
    );
    expect(
      within(banner).getByRole('button', { name: /Secondary move-in/i })
    ).toBeInTheDocument();

    // Apply a status filter that excludes the (Running) cancelling process.
    store.states.set([MeteringPointProcessState.Canceled]);
    TestBed.tick();

    // It has left the visible (filtered) table...
    expect(store.visibleProcessIds().has('process-cancelling')).toBe(false);

    // ...so the banner now shows the process name as plain text, not a link.
    expect(
      within(banner).queryByRole('button', { name: /Secondary move-in/i })
    ).not.toBeInTheDocument();
    expect(within(banner).getByText(/Secondary move-in/i).tagName).toBe('SPAN');
  });

  it('should not show the cross-cancellation banner when the process was not cancelled by another process', async () => {
    await setup('process-eos-cancel');

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('should render the cancellation step label in the step table for a cancelled process', async () => {
    // A cancelled process carries a trailing cancellation step whose backend id is
    // `CANCELLATION_STEP_V1_STEP_1` (BFF derives it from the "Cancellation_Step"
    // UniqueName). It resolves through the step-name fallback to the translated
    // label, so a wrong/removed key would surface the raw id and fail this.
    // The label is generic on purpose: the same step can produce different RSM
    // messages (RSM-004 / RSM-020 / RSM-025) depending on the calling workflow,
    // so the translation does not bake the RSM number in.
    await setup('process-cross-cancelled');

    await waitForAsync(() => expect(screen.getByText(/^Process cancelled$/i)).toBeInTheDocument());
  });

  it('should navigate to the cancelling process when the banner link is clicked', async () => {
    const fixture = await setup('process-cross-cancelled');
    const user = userEvent.setup();
    const router = fixture.debugElement.injector.get(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const banner = await screen.findByRole('note');
    // The link only renders once the overview query resolves and the cancelling
    // process id appears in the store's visible list, so wait for it.
    const link = await within(banner).findByRole('button', { name: /Secondary move-in/i });

    await user.click(link);

    await waitForAsync(() =>
      expect(navigateSpy).toHaveBeenCalledWith(
        ['details', 'process-cancelling'],
        expect.any(Object)
      )
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
