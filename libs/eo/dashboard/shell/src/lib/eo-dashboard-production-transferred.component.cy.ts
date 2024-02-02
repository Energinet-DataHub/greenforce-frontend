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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EoDashboardProductionTransferredComponent } from './eo-dashboard-production-transferred.component';
import { provideRouter } from '@angular/router';
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';

describe('EO - Transferred Chart', () => {
  type configKey = 'aggregate-claims' | 'aggregate-certificates' | 'aggregate-transfers';
  type configValue = 'has-error' | 'no-data';

  const getError = () => cy.findByTestId('error');
  const errorShouldBeVisible = () => getError().should('be.visible');

  const getNoData = () => cy.findByTestId('no-data');
  const getUnusedLegend = () => cy.findByTestId('unused-legend');
  const getConsumedLegend = () => cy.findByTestId('consumed-legend');
  const getTransferredLegend = () => cy.findByTestId('transferred-legend');
  const getHeadline = () => cy.findByTestId('headline');

  function setMockingServer(key: configKey, state: configValue) {
    localStorage.setItem(key, state);
  }

  function initComponent() {
    cy.mount(EoDashboardProductionTransferredComponent, {
      providers: [provideHttpClient(withInterceptorsFromDi()), provideRouter([])],
      componentProperties: {
        period: { timeAggregate: EoTimeAggregate.Day, start: 1698303600, end: 1700222400 },
      },
    });
  }

  it('should show error if aggregated claims fails', () => {
    initComponent();
    setMockingServer('aggregate-claims', 'has-error');
    errorShouldBeVisible();
  });

  it('should show error if aggregated transfers fails', () => {
    initComponent();
    setMockingServer('aggregate-transfers', 'has-error');
    errorShouldBeVisible();
  });

  it('should show error if aggregated certificates fails', () => {
    initComponent();
    setMockingServer('aggregate-certificates', 'has-error');
    errorShouldBeVisible();
  });

  it('should inform the user when there is no data', () => {
    setMockingServer('aggregate-claims', 'no-data');
    setMockingServer('aggregate-transfers', 'no-data');
    setMockingServer('aggregate-certificates', 'no-data');
    initComponent();

    getNoData().should('be.visible');
    getUnusedLegend().contains('0%');
    getConsumedLegend().contains('0%');
    getTransferredLegend().contains('0%');
  });

  it('should show correct percentages in legends and header', () => {
    initComponent();

    getUnusedLegend().contains('80%');
    getConsumedLegend().contains('<1%');

    const transferredPercentage = '20%';
    getTransferredLegend().contains(transferredPercentage);
    getHeadline().contains(transferredPercentage);
  });
});
