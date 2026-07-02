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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { render, screen } from '@testing-library/angular';

import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';

import { DhFailedProcessDetails } from '../src/components/details';
import { DhFailedProcessesStore } from '../src/components/failed-processes.store';

async function setup(processId: string) {
  const { fixture } = await render(DhFailedProcessDetails, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      DhNavigationService,
      // Route-scoped in the real app; there is no by-id query, so the drawer
      // finds its row in this store's loaded list.
      DhFailedProcessesStore,
      { provide: ComponentFixtureAutoDetect, useValue: true },
    ],
    configureTestBed: (testBed) =>
      testBed.overrideProvider(ActivatedRoute, {
        useValue: { data: of({}), children: [], firstChild: null },
      }),
    imports: [getTranslocoTestingModule()],
    componentInputs: { id: processId },
  });

  await waitForAsync(() => expect(document.querySelector('watt-drawer')).not.toBeNull());

  return fixture;
}

describe('Failed process details', () => {
  it('renders the drawer with the data of the selected row', async () => {
    // The BRS-002 row with UNHANDLED_FAILURE and a suspend context.
    await setup('0199f1c2-a3b4-7180-9546-39b5836fb001');

    // Process label as heading.
    await waitForAsync(() =>
      expect(screen.getByRole('heading', { name: 'End of supply (BRS-002)' })).toBeInTheDocument()
    );

    // Status badge in the topbar and the error section.
    expect(screen.getAllByText('Unexpected error')).toHaveLength(2);

    // Description list values: registered in DataHub (createdAt), started by, MP ID,
    // and the error section's registered (suspendedAt) and orchestration id.
    const values = screen.getAllByRole('definition').map((dd) => dd.textContent?.trim());
    expect(values).toContain('10-06-2026 12:48');
    expect(values).toContain('1899805560104 · Netvirksomhed 01 (Grid access provider)');
    expect(values).toContain('571397488097288280');
    expect(values).toContain('10-06-2026 13:02');
    expect(values).toContain('0199f1c2-a3b4-7180-9546-39b5836fbf01');

    // Process ID copy action.
    expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument();

    // Suspend context (truncated exception) is rendered.
    expect(screen.getByRole('paragraph')).toHaveTextContent(/System\.InvalidOperationException/);
  });

  it('renders a plain "-" fallback for a row without process type and owner', async () => {
    // The USER_REQUESTED row with processType: null and createdBy: null.
    await setup('0199f1c2-a3b4-7180-9546-39b5836fb004');

    await waitForAsync(() =>
      expect(screen.getByRole('heading', { name: '-' })).toBeInTheDocument()
    );

    // The "Started by" value falls back to "-" as well.
    const startedByLabel = screen
      .getAllByRole('term')
      .find((dt) => dt.textContent?.trim() === 'Started by');
    expect(startedByLabel?.nextElementSibling).toHaveTextContent('-');

    expect(screen.getAllByText('Manually suspended')).toHaveLength(2);
  });
});
