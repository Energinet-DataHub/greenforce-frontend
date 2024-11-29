import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';
import { translocoProviders } from '@energinet-datahub/eo/globalization/configuration-localization';

import { EoDashboardConsumptionComponent } from './eo-dashboard-consumption.component';

describe('EO - Consumption Chart', () => {
  type configKey = 'aggregate-claims' | 'aggregate-certificates';
  type configValue = 'has-error' | 'no-data';

  const getError = () => cy.findByTestId('error');
  const errorShouldBeVisible = () => getError().should('be.visible');

  const getNoData = () => cy.findByTestId('no-data');
  const getOtherLegend = () => cy.findByTestId('other-legend');
  const getGreenLegend = () => cy.findByTestId('green-legend');
  const getHeadline = () => cy.findByTestId('headline');

  function setMockingServer(key: configKey, state: configValue) {
    localStorage.setItem(key, state);
  }

  function initComponent() {
    cy.mount(EoDashboardConsumptionComponent, {
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

  it('should show error if aggregated certificates fails', () => {
    initComponent();
    setMockingServer('aggregate-certificates', 'has-error');
    errorShouldBeVisible();
  });

  it('should inform the user when there is no data', () => {
    setMockingServer('aggregate-claims', 'no-data');
    setMockingServer('aggregate-certificates', 'no-data');
    initComponent();

    getNoData().should('be.visible');
    getOtherLegend().contains('0%');
    getGreenLegend().contains('0%');
  });

  it.only('should show correct percentages in legends and header', () => {
    initComponent();

    getOtherLegend().contains('2%');

    const greenEnergyPercentage = '98%';
    getGreenLegend().contains(greenEnergyPercentage);
    getHeadline().contains(greenEnergyPercentage);
  });
});
