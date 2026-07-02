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
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import type { WattRange } from '@energinet/watt/date';
import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { FailedProcessSuspendReason } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhFailedProcesses } from '../src/components/table';
import { DhFailedProcessesStore } from '../src/components/failed-processes.store';

async function setup() {
  const { fixture } = await render(DhFailedProcesses, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      // Route-scoped in the real app; the table and drawer share this instance.
      DhFailedProcessesStore,
      { provide: ComponentFixtureAutoDetect, useValue: true },
    ],
    // Stub ActivatedRoute (overridden AFTER the module-level `provideRouter([])`
    // appended by the shared testbed) for the co-injected DhNavigationService;
    // `children`/`firstChild` mirror an empty root route.
    configureTestBed: (testBed) =>
      testBed.overrideProvider(ActivatedRoute, {
        useValue: { data: of({}), children: [], firstChild: null },
      }),
    imports: [getTranslocoTestingModule()],
  });

  await waitForAsync(() =>
    expect(document.querySelector('[role="treegrid"] [role="gridcell"]')).not.toBeNull()
  );

  return { fixture };
}

// Count the rows the user actually sees (includes one column-header row).
function renderedRowCount(): number {
  return screen.getByRole('treegrid').querySelectorAll('[role="row"]').length;
}

// Drive the REAL filter chain as the component wires it: write the component's
// PUBLIC reactive-form controls, which emit `valueChanges`, which the component
// pushes into the store signals, which feed `filteredProcesses()`.
function applyFilters(
  fixture: ComponentFixture<DhFailedProcesses>,
  filters: {
    suspendReasons?: FailedProcessSuspendReason[];
    processTypes?: string[];
    owners?: string[];
    period?: WattRange<Date>;
  }
): void {
  const { form } = fixture.componentInstance;
  if (filters.suspendReasons) form.controls.suspendReasons.setValue(filters.suspendReasons);
  if (filters.processTypes) form.controls.processTypes.setValue(filters.processTypes);
  if (filters.owners) form.controls.owners.setValue(filters.owners);
  if (filters.period) form.controls.period.setValue(filters.period);

  TestBed.tick();
}

describe('Failed processes overview', () => {
  it('renders the mocked rows with translated BRS and status labels', async () => {
    await setup();
    const grid = within(screen.getByRole('treegrid'));

    // One header row plus the four mocked rows.
    expect(renderedRowCount()).toBe(5);

    // BRS labels reuse the shared process-type table.
    expect(grid.getByText('End of supply (BRS-002)')).toBeInTheDocument();
    expect(grid.getByText('Move-in (BRS-009)')).toBeInTheDocument();
    expect(grid.getByText('Change of energy supplier (BRS-001)')).toBeInTheDocument();

    // Status labels are the translated suspend reasons.
    expect(grid.getByText('Unexpected error')).toBeInTheDocument();
    expect(grid.getByText('Ran for too long')).toBeInTheDocument();
    expect(grid.getByText('Orchestration failed')).toBeInTheDocument();
    expect(grid.getByText('Manually suspended')).toBeInTheDocument();

    // Owner is "<gln> · <name> (<role label>)".
    expect(
      grid.getByText('1899805560104 · Netvirksomhed 01 (Grid access provider)')
    ).toBeInTheDocument();

    // Registered renders date + time in the Danish time zone.
    expect(grid.getByText('10-06-2026 12:48')).toBeInTheDocument();
  });

  it('renders a plain "-" for rows without a process type or owner', async () => {
    await setup();

    // The fourth mocked row carries processType: null and createdBy: null.
    const cell = screen.getByRole('gridcell', { name: '571313180400090047' });
    const row = cell.closest('[role="row"]') as HTMLElement;
    expect(row).not.toBeNull();
    expect(within(row).getAllByText('-')).toHaveLength(2);
  });

  it('marks the clicked row as active and navigates to its details', async () => {
    const { fixture } = await setup();
    const user = userEvent.setup();
    const router = fixture.debugElement.injector.get(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await user.click(screen.getByText('End of supply (BRS-002)'));

    expect(router.navigate).toHaveBeenCalledWith(
      ['details', '0199f1c2-a3b4-7180-9546-39b5836fb001'],
      expect.objectContaining({ queryParamsHandling: 'preserve' })
    );

    // Exactly one row carries the active-row marking in the DOM.
    const grid = screen.getByRole('treegrid');
    expect(grid.querySelectorAll('tr.watt-table-active-row').length).toBe(1);
  });

  it('narrows the rendered table to rows matching the chosen status', async () => {
    const { fixture } = await setup();
    const baselineRows = renderedRowCount();

    applyFilters(fixture, { suspendReasons: [FailedProcessSuspendReason.UnhandledFailure] });

    // Only the single UNHANDLED_FAILURE row remains.
    expect(renderedRowCount()).toBe(baselineRows - 3);
  });

  it('narrows the rendered table to rows matching the chosen BRS', async () => {
    const { fixture } = await setup();
    const baselineRows = renderedRowCount();

    applyFilters(fixture, { processTypes: ['BRS_002_EndOfSupply'] });

    expect(renderedRowCount()).toBe(baselineRows - 3);
  });

  it('narrows the rendered table to rows matching the chosen owner', async () => {
    const { fixture } = await setup();
    const baselineRows = renderedRowCount();

    // The owner filter holds MarketParticipant ids; this is "Netvirksomhed 01".
    applyFilters(fixture, { owners: ['0199f1c2-a3b4-7180-9546-39b5836fba01'] });

    expect(renderedRowCount()).toBe(baselineRows - 3);
  });

  it('narrows the rendered table to rows registered within the chosen period', async () => {
    const { fixture } = await setup();
    const baselineRows = renderedRowCount();

    // June 2026 contains the BRS-002 (Jun 10) and BRS-009 (Jun 8) rows only.
    applyFilters(fixture, {
      period: {
        start: new Date('2026-06-01T00:00:00'),
        end: new Date('2026-06-30T23:59:59.999'),
      },
    });

    expect(renderedRowCount()).toBe(baselineRows - 2);
  });

  it('shows the reset button once a filter is applied and restores the full table on reset', async () => {
    const { fixture } = await setup();
    const user = userEvent.setup();
    const baselineRows = renderedRowCount();
    const filterBar = document.querySelector('watt-data-filters') as HTMLElement;

    // Default blank state: nothing to reset, so the user sees no reset button.
    expect(within(filterBar).queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();

    applyFilters(fixture, { suspendReasons: [FailedProcessSuspendReason.UnhandledFailure] });
    expect(renderedRowCount()).toBe(baselineRows - 3);

    const resetButton = within(filterBar).getByRole('button', { name: /Reset/i });
    await user.click(resetButton);
    TestBed.tick();

    expect(renderedRowCount()).toBe(baselineRows);
    expect(within(filterBar).queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();
  });
});
