import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { translocoProviders } from '@energinet-datahub/eo/globalization/configuration-localization';
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';

import { EoDashboardProductionTransferredComponent } from './eo-dashboard-production-transferred.component';

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
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        ...translocoProviders,
      ],
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
