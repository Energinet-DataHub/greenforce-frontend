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
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  OutgoingDocumentTypeV1,
  BusinessReasonV1,
  MessageCategoryV1,
} from '@energinet-datahub/dh/shared/domain/graphql';
import type { QueuedMessage } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhMessageQueueOverview } from '../src/overview';

async function setup(permissionOverrides: { isFas?: boolean } = {}) {
  const { isFas = false } = permissionOverrides;

  const { fixture } = await render(DhMessageQueueOverview, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      { provide: ComponentFixtureAutoDetect, useValue: true },
      {
        provide: PermissionService,
        useValue: {
          isFas: () => of(isFas),
          hasMarketRole: () => of(true),
          hasPermission: () => of(true),
        },
      },
      {
        provide: DhActorStorage,
        useValue: {
          getSelectedActor: () => ({
            id: 'actor-1',
            gln: '5790001330552',
            actorName: 'Test Actor',
            organizationName: 'Test Org',
            marketRole: 'EnergySupplier',
            displayName: 'Test Actor (5790001330552)',
          }),
          getSelectedActorId: () => 'actor-1',
        },
      },
    ],
    imports: [getTranslocoTestingModule()],
  });

  return fixture;
}

describe('DhMessageQueueOverview', () => {
  it('should render tabs in correct order (Masterdata, Measure data, Settlements) with counts', async () => {
    await setup();

    await waitForAsync(() => {
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
      // Order: Processes (Masterdata) -> MeasureData -> Aggregations (Settlements)
      expect(radios[0].textContent).toContain('Masterdata');
      expect(radios[0].textContent).toContain('3');
      expect(radios[1].textContent).toContain('Measure data');
      expect(radios[1].textContent).toContain('2');
      expect(radios[2].textContent).toContain('Settlements');
      expect(radios[2].textContent).toContain('1');
    });
  });

  it('should show actor dropdown only for FAS users', async () => {
    await setup({ isFas: true });

    await waitForAsync(() => {
      expect(document.querySelector('watt-dropdown')).not.toBeNull();
    });

    expect(screen.getByText('Select actor')).toBeInTheDocument();
  });

  it('should not show actor dropdown for non-FAS users', async () => {
    await setup({ isFas: false });

    await waitForAsync(() => {
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
    });

    expect(document.querySelector('watt-dropdown')).toBeNull();
  });

  it('should show data table when actor is selected (non-FAS user)', async () => {
    await setup({ isFas: false });

    await waitForAsync(() => {
      expect(screen.getByRole('treegrid')).toBeInTheDocument();
    });
  });

  it('should translate document types via column accessor', async () => {
    const fixture = await setup({ isFas: false });

    await waitForAsync(() => {
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
    });

    const component = fixture.componentInstance;
    const documentTypeAccessor = component.columns.documentType.accessor;

    // The accessor should be a function that translates enum values
    expect(typeof documentTypeAccessor).toBe('function');
    const accessor = documentTypeAccessor as (row: QueuedMessage) => string;

    // Verify that column accessor returns translated display names, not raw enum values
    const acknowledgementRow = {
      documentType: OutgoingDocumentTypeV1.Acknowledgement,
    } as QueuedMessage;
    expect(accessor(acknowledgementRow)).toBe('Acknowledgement');

    const aggregatedRow = {
      documentType: OutgoingDocumentTypeV1.NotifyAggregatedMeasureData,
    } as QueuedMessage;
    expect(accessor(aggregatedRow)).toBe('Aggregated measure data');

    const validatedRow = {
      documentType: OutgoingDocumentTypeV1.NotifyValidatedMeasureData,
    } as QueuedMessage;
    expect(accessor(validatedRow)).toBe('Validated measure data');
  });

  it('should translate business reasons via column accessor', async () => {
    const fixture = await setup({ isFas: false });

    await waitForAsync(() => {
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
    });

    const component = fixture.componentInstance;
    const businessReasonAccessor = component.columns.businessReason.accessor;

    // The accessor should be a function that translates enum values
    expect(typeof businessReasonAccessor).toBe('function');
    const accessor = businessReasonAccessor as (row: QueuedMessage) => string;

    // Verify that column accessor returns translated display names, not raw enum values
    const moveInRow = { businessReason: BusinessReasonV1.CustomerMoveIn } as QueuedMessage;
    expect(accessor(moveInRow)).toBe('Customer move in');

    const balanceRow = { businessReason: BusinessReasonV1.BalanceSettlement } as QueuedMessage;
    expect(accessor(balanceRow)).toBe('Balance settlement');

    const supplierRow = {
      businessReason: BusinessReasonV1.ChangeOfEnergySupplier,
    } as QueuedMessage;
    expect(accessor(supplierRow)).toBe('Change of energy supplier');

    const wholesaleRow = { businessReason: BusinessReasonV1.WholeSettlement } as QueuedMessage;
    expect(accessor(wholesaleRow)).toBe('Wholesale settlement');
  });

  it('should update activeDataSource when selectedCategory changes', async () => {
    const fixture = await setup({ isFas: false });

    // Wait for data to load
    await waitForAsync(() => {
      expect(fixture.componentInstance.activeDataSource.data.length).toBeGreaterThan(0);
    });

    const component = fixture.componentInstance;

    // Default: first category (Processes/Masterdata)
    const initialDs = component.activeDataSource;
    expect(initialDs.data.length).toBe(3);

    // Switch to MeasureData
    component.selectedCategory.set(MessageCategoryV1.MeasureData);
    fixture.detectChanges();

    const measureDs = component.activeDataSource;
    expect(measureDs.data.length).toBe(2);

    // Switch to Aggregations
    component.selectedCategory.set(MessageCategoryV1.Aggregations);
    fixture.detectChanges();

    const aggregationsDs = component.activeDataSource;
    expect(aggregationsDs.data.length).toBe(1);
  });

  it('should return empty dataSource for category with no messages', async () => {
    const fixture = await setup({ isFas: false });

    await waitForAsync(() => {
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
    });

    const component = fixture.componentInstance;

    // Set a category that doesn't exist in the data
    component.selectedCategory.set('NON_EXISTENT');
    fixture.detectChanges();

    const ds = component.activeDataSource;
    expect(ds.data.length).toBe(0);
  });

  it('should select first category as default when data loads', async () => {
    const fixture = await setup({ isFas: false });

    await waitForAsync(() => {
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
    });

    const component = fixture.componentInstance;

    // After data loads, selectedCategory should be the first sorted category (Processes)
    expect(component.selectedCategory()).toBe(MessageCategoryV1.Processes);
  });

  it('should show count of 0 for categories without messages', async () => {
    const fixture = await setup({ isFas: false });

    await waitForAsync(() => {
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBe(3);
    });

    const component = fixture.componentInstance;

    // getCount should return 0 for a category not in the API response
    expect(component.getCount('NON_EXISTENT')).toBe(0);
  });

  it('should load queues when FAS user selects an actor', async () => {
    const fixture = await setup({ isFas: true });

    // Dropdown should be visible
    await waitForAsync(() => {
      expect(document.querySelector('watt-dropdown')).not.toBeNull();
    });

    const component = fixture.componentInstance;

    // Simulate actor selection
    component.actorControl.setValue('5790001330552|EnergySupplier');
    fixture.detectChanges();

    // Wait for data to load after actor selection
    await waitForAsync(() => {
      expect(component.activeDataSource.data.length).toBeGreaterThan(0);
    });

    // Segmented buttons should be visible with data
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(3);
    expect(component.queues().length).toBeGreaterThan(0);
  });
});
