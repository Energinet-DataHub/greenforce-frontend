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
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import type { WattRange } from '@energinet/watt/date';
import { WattModalService } from '@energinet/watt/modal';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  EicFunction,
  MeteringPointProcessState,
  ProcessManagerBusinessReason,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { DhReleaseToggleService } from '@energinet-datahub/dh/shared/util-release-toggle';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';

import { DhMeteringPointProcessOverviewTable } from '../src/components/overview';
import { DhMeteringPointProcessOverviewStore } from '../src/components/metering-point-process-overview.store';

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
      // The overview now reads its data from the store, which derives the
      // overview query variables from inherited route data.
      DhMeteringPointProcessOverviewStore,
      { provide: ComponentFixtureAutoDetect, useValue: true },
      {
        provide: DhReleaseToggleService,
        useValue: { isEnabled: () => true, toggles: () => [] },
      },
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
            // Deliberately NOT matching any mock initiator's GLN. The overview
            // tests are about role-based button filtering, not the
            // InitiatingParticipant path. If we used a GLN that overlaps a mock
            // initiator (e.g. the by-id mock's first row), Apollo's normalised
            // cache could leak that GLN into the overview's initiator (entities
            // are keyed by id), making InitiatingParticipant spuriously match
            // and showing buttons for actors that should not see them.
            gln: '0000000000000',
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
    // `children`/`firstChild` mirror an empty root route. The overview feeds the
    // store's metering point id from its input, so no route data is needed here.
    configureTestBed: (testBed) =>
      testBed.overrideProvider(ActivatedRoute, {
        useValue: { data: of({}), children: [], firstChild: null },
      }),
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

  return { fixture };
}

/**
 * Count the rows the user actually sees in the rendered table. The Material table
 * emits `role="row"` for the column-header row as well as the data rows, so this
 * count includes one header row. The tests below establish a baseline with the
 * full (unfiltered) set and then assert the narrowed count against that baseline,
 * so the constant header offset cancels out without being hard-coded.
 *
 * Rows carry an explicit `role="row"` attribute (the table also sets explicit
 * `role="treegrid"`/`role="gridcell"`), so a direct attribute query counts the same
 * rows as `getAllByRole('row')` would, but without the expensive accessibility-tree
 * walk that makes `getAllByRole` take seconds per call over this ~60-row fixture.
 */
function renderedRowCount(): number {
  return screen.getByRole('treegrid').querySelectorAll('[role="row"]').length;
}

/**
 * Drive the REAL filter chain as the component wires it: write the component's
 * PUBLIC reactive-form controls, which emit `valueChanges`, which the component
 * pushes into the store signals, which feed `filteredProcesses()`, which the
 * table's `dataSource` renders. We deliberately do NOT poke the store signals
 * directly: that would bypass the bridge and, for the reset test, leave the form
 * empty so the native form reset would have nothing to clear (a false positive).
 *
 * `watt-dropdown` overlays are not reliably openable in this jsdom harness (no DH
 * spec drives them via the overlay; the established pattern, e.g.
 * message-queue/feature-overview, sets the public form control). The component is
 * strongly typed, so no `as unknown as {...}` cast is needed.
 */
function applyFilters(
  fixture: ComponentFixture<DhMeteringPointProcessOverviewTable>,
  filters: {
    states?: MeteringPointProcessState[];
    businessReasons?: ProcessManagerBusinessReason[];
    period?: WattRange<Date>;
  }
): void {
  const { form } = fixture.componentInstance;
  if (filters.states) form.controls.states.setValue(filters.states);
  if (filters.businessReasons) form.controls.businessReasons.setValue(filters.businessReasons);
  if (filters.period) form.controls.period.setValue(filters.period);

  // Flush the signals/effects the form change feeds (valueChanges -> store signal
  // -> filteredProcesses -> dataSource) so the table re-renders before we assert.
  TestBed.tick();
}

describe('Process overview', () => {
  it('marks the active row when navigation targets a loaded process (cross-cancellation link)', async () => {
    const { fixture } = await setup();
    const router = fixture.debugElement.injector.get(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const navigation = fixture.debugElement.injector.get(DhNavigationService);

    // Issue 1549: the banner link calls navigation.navigate('details', id) on the shared
    // DhNavigationService; before the fix `selection` froze at `undefined` and never marked it.
    navigation.navigate('details', 'process-cancelling');
    TestBed.tick();

    // The process IS in the loaded list, so it must now be the active selection...
    expect(fixture.componentInstance.selection()?.id).toBe('process-cancelling');

    // ...and exactly one row must carry the active-row marking in the DOM.
    const grid = screen.getByRole('treegrid');
    expect(grid.querySelectorAll('tr.watt-table-active-row').length).toBe(1);
  });

  it('should render the table with process data', async () => {
    await setup();
    expect(screen.getByRole('treegrid')).toBeInTheDocument();
  });

  it('should show the period filter', async () => {
    await setup();
    expect(screen.getByText('Period')).toBeInTheDocument();
  });

  it('should render the period filter blank by default', async () => {
    await setup();

    // Blank means the chip projects only its label and shows no chosen date, so the
    // user sees no year text inside it.
    const chip = screen.getByText('Period').closest('watt-menu-chip');
    expect(chip).not.toBeNull();
    expect(within(chip as HTMLElement).queryByText(/\d{4}/)).not.toBeInTheDocument();
  });

  it('should narrow the rendered table to rows matching the chosen status', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);

    // Baseline: the rows the user sees with no filter applied (includes the header row).
    const baselineRows = renderedRowCount();

    // Falsifiability guard on the FIXTURE DATA (read once to size the assertion): the
    // status filter only proves narrowing if some loaded rows are Running and some are not.
    const fullDataRows = store.processes().length;
    const runningRows = store
      .processes()
      .filter((p) => p.state === MeteringPointProcessState.Running).length;
    expect(runningRows).toBeGreaterThan(0);
    expect(runningRows).toBeLessThan(fullDataRows);

    applyFilters(fixture, { states: [MeteringPointProcessState.Running] });

    // The rendered table now shows only the Running rows. The header offset is the
    // same as in the baseline, so subtract the rows that were filtered out.
    expect(renderedRowCount()).toBe(baselineRows - (fullDataRows - runningRows));
  });

  it('should narrow the rendered table to rows matching the chosen type', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);

    const baselineRows = renderedRowCount();

    const fullDataRows = store.processes().length;
    const endOfSupplyRows = store
      .processes()
      .filter((p) => p.businessReason === ProcessManagerBusinessReason.EndOfSupply).length;
    expect(endOfSupplyRows).toBeGreaterThan(0);
    expect(endOfSupplyRows).toBeLessThan(fullDataRows);

    applyFilters(fixture, {
      businessReasons: [ProcessManagerBusinessReason.EndOfSupply],
    });

    expect(renderedRowCount()).toBe(baselineRows - (fullDataRows - endOfSupplyRows));
  });

  it('should combine the type and status filters with AND in the rendered table', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);

    const baselineRows = renderedRowCount();

    const fullDataRows = store.processes().length;
    const matchingRows = store
      .processes()
      .filter(
        (p) =>
          p.businessReason === ProcessManagerBusinessReason.EndOfSupply &&
          p.state === MeteringPointProcessState.Running
      ).length;
    // Guard: the AND combination must match a non-empty, narrowed subset, and that
    // subset must be strictly smaller than either single filter to prove it is an AND.
    const endOfSupplyRows = store
      .processes()
      .filter((p) => p.businessReason === ProcessManagerBusinessReason.EndOfSupply).length;
    expect(matchingRows).toBeGreaterThan(0);
    expect(matchingRows).toBeLessThan(endOfSupplyRows);

    applyFilters(fixture, {
      businessReasons: [ProcessManagerBusinessReason.EndOfSupply],
      states: [MeteringPointProcessState.Running],
    });

    expect(renderedRowCount()).toBe(baselineRows - (fullDataRows - matchingRows));
  });

  it('should render every loaded row when no filters are applied', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);

    // One header row plus one rendered row per loaded process.
    expect(renderedRowCount()).toBe(store.processes().length + 1);
  });

  it('should restore the full table when the reset button is clicked', async () => {
    const { fixture } = await setup();
    const store = fixture.debugElement.injector.get(DhMeteringPointProcessOverviewStore);
    const user = userEvent.setup();

    const baselineRows = renderedRowCount();

    // Size the expected narrowed count from the fixture (read once), and guard that
    // it is a strict subset so the restore assertion is meaningful.
    const fullDataRows = store.processes().length;
    const matchingRows = store
      .processes()
      .filter(
        (p) =>
          p.businessReason === ProcessManagerBusinessReason.EndOfSupply &&
          p.state === MeteringPointProcessState.Running
      ).length;
    expect(matchingRows).toBeGreaterThan(0);
    expect(matchingRows).toBeLessThan(fullDataRows);

    // Drive the real form -> valueChanges -> store bridge so the controls actually
    // hold values that the native `type="reset"` button must clear. Setting store
    // signals alone would not leave the form in a state reset could change. Use only
    // the client-side filters (no period) so the narrowing is the rendered effect of
    // `filteredProcesses`, not a transient loading state from a refetch.
    applyFilters(fixture, {
      states: [MeteringPointProcessState.Running],
      businessReasons: [ProcessManagerBusinessReason.EndOfSupply],
    });

    // The table is genuinely narrowed first, so the restore assertion is meaningful.
    expect(renderedRowCount()).toBe(baselineRows - (fullDataRows - matchingRows));

    await user.click(screen.getByRole('button', { name: /Reset/i }));
    TestBed.tick();

    // The rendered table is back to the full set the user started with.
    expect(renderedRowCount()).toBe(baselineRows);
  });

  it('should not render the reset button when no filter is applied', async () => {
    await setup();

    // Default blank state: nothing to reset, so the user sees no reset button.
    expect(screen.queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();
  });

  it('should render the reset button once a filter is applied and hide it again after reset', async () => {
    const { fixture } = await setup();
    const user = userEvent.setup();
    const filterBar = document.querySelector('watt-data-filters') as HTMLElement;

    // Applying a filter gives the user something to reset, so the button appears.
    applyFilters(fixture, { states: [MeteringPointProcessState.Running] });
    const resetButton = within(filterBar).getByRole('button', { name: /Reset/i });
    expect(resetButton).toBeInTheDocument();

    // Resetting returns to the blank default, so the button disappears again.
    await user.click(resetButton);
    TestBed.tick();
    expect(within(filterBar).queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();
  });

  it('should show cancel button and open modal when clicked', async () => {
    // Cancel is now restricted to the responsible EnergySupplier; the default
    // GridAccessProvider actor would no longer see the button.
    await setup({
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: true,
    });
    const user = userEvent.setup();

    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0)
    );
    const cancelButtons = screen.getAllByRole('button', { name: /Cancel/i });

    await user.click(cancelButtons[0]);

    await waitForAsync(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    await waitForAsync(() => {
      const buttons = Array.from(document.querySelectorAll('[role="dialog"] button'));
      expect(buttons.some((b) => /sure/i.test(b.textContent || ''))).toBe(true);
    });
  });

  it('should show send information button and navigate when clicked', async () => {
    const { fixture } = await setup();
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
        ['metering-point', 'imp-456', 'update-customer-details', expect.any(String)],
        expect.objectContaining({ queryParams: expect.any(Object) })
      )
    );
  });

  it('should hide all action buttons for unrelated market roles', async () => {
    await setup({ actorMarketRole: EicFunction.DataHubAdministrator });
    await waitForAsync(() =>
      expect(document.querySelector('[role="treegrid"] vater-stack')).not.toBeNull()
    );
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Send information/i })).toHaveLength(0);
  });

  it('should show generic possible-actions text instead of buttons for FAS users', async () => {
    await setup({ isFas: true, actorMarketRole: EicFunction.DataHubAdministrator });
    await waitForAsync(() => {
      const emphasised = screen.getAllByRole('emphasis');
      const match = emphasised.find((el) =>
        /Possible actions for actors/i.test(el.textContent ?? '')
      );
      expect(match).toBeDefined();
    });
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

    await waitForAsync(() =>
      expect(document.querySelector('[role="treegrid"] vater-stack')).not.toBeNull()
    );
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
    expect(screen.queryAllByRole('button', { name: /Send information/i })).toHaveLength(0);
    expect(screen.queryAllByText(/Possible actions for actors/i)).toHaveLength(0);
  });

  it('should still show action buttons for GridAccessProvider regardless of responsibility', async () => {
    // GridAccessProvider can no longer cancel end-of-supply (that is the
    // requester's right). Reject is now the GridAccessProvider-owned action,
    // and is independent of EnergySupplier responsibility.
    await setup({
      actorMarketRole: EicFunction.GridAccessProvider,
      isEnergySupplierResponsible: false,
    });
    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Reject request/i }).length).toBeGreaterThan(0)
    );
    expect(screen.queryAllByRole('button', { name: /Cancel/i })).toHaveLength(0);
  });

  it('should show "Request correction" button when BFF flags InitiateIncorrectMoveIn as available', async () => {
    await setup({
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: true,
    });

    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Request correction/i }).length).toBeGreaterThan(
        0
      )
    );
  });

  it('should open the request-incorrect-move-in modal when "Request correction" is clicked', async () => {
    await setup({
      actorMarketRole: EicFunction.EnergySupplier,
      isEnergySupplierResponsible: true,
    });
    const user = userEvent.setup();

    await waitForAsync(() =>
      expect(screen.getAllByRole('button', { name: /Request correction/i }).length).toBeGreaterThan(
        0
      )
    );

    const button = screen.getAllByRole('button', { name: /Request correction/i })[0];
    await user.click(button);

    await waitForAsync(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveTextContent(/Request correction: Incorrect move/i);
    });
  });

  it('should show the translated role in the initiator column when the initiator is masked', async () => {
    // `process-masked-initiator` has a null resolved participant but an
    // initiatorRole of GridAccessProvider, so the initiator column falls back to
    // the translated role ("Grid access provider") instead of a GLN.
    await setup();

    await waitForAsync(() => expect(screen.getByRole('treegrid')).toBeInTheDocument());

    const grid = screen.getByRole('treegrid');
    await waitForAsync(() =>
      expect(within(grid).getAllByText(/Grid access provider/i).length).toBeGreaterThan(0)
    );
  });
});
