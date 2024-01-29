import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { danishLocalProviders } from '@energinet-datahub/gf/configuration-danish-locale';

import { EoDashboardShellComponent } from './eo-dashboard-shell.component';

describe('EO - Dashboard', () => {
  const getProductionTab = () => cy.findByRole('tab', { name: /Production/i });
  const getConsumptionTab = () => cy.findByRole('tab', { name: /Consumption/i });

  const getProductionChart = () => cy.get('eo-dashboard-production-transferred');
  const getConsumptionChart = () => cy.get('eo-dashboard-consumption');
  const getChoosePeriod = () => cy.get('eo-dashboard-choose-period');

  const getNoData = () => cy.findByTestId('no-data');
  const getError = () => cy.findByTestId('error');

  const meteringPointsConfigKey = 'metering-points';
  type meteringPointsConfigValue = 'no-metering-points' | 'only-consumption-metering-points' | 'only-production-metering-points' | 'all-metering-points' | 'metering-points-error';

  function setup(meteringPointsScenario: meteringPointsConfigValue = 'all-metering-points') {
    cy.mount(EoDashboardShellComponent, {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideNoopAnimations(),
        provideRouter([], withComponentInputBinding()),
        danishLocalProviders,
        danishDatetimeProviders,
      ],
    });

    localStorage.setItem(meteringPointsConfigKey, meteringPointsScenario);
  }


  it('should handle no metering points', () => {
    setup('no-metering-points');

    getNoData().should('exist');

    getError().should('not.exist');
    getProductionTab().should('not.exist');
    getConsumptionTab().should('not.exist');
    getProductionChart().should('not.exist');
    getConsumptionChart().should('not.exist');
    getChoosePeriod().should('not.exist');
  });

  it('should handle no production metering points', () => {
    setup('only-consumption-metering-points');

    getConsumptionTab().should('exist');
    getConsumptionChart().should('exist');
    getChoosePeriod().should('exist');

    getError().should('not.exist');
    getNoData().should('not.exist');
    getProductionChart().should('not.exist');
    getProductionTab().should('not.exist');
  });

  it('should handle no consumption metering points', () => {
    setup('only-production-metering-points');

    getProductionTab().should('exist');
    getProductionChart().should('exist');
    getChoosePeriod().should('exist');

    getConsumptionChart().should('not.exist');
    getConsumptionTab().should('not.exist');
    getNoData().should('not.exist');
    getError().should('not.exist');
  });

  it('should handle both production and consumption metering points', () => {
    setup('all-metering-points');

    getProductionTab().should('exist');
    getProductionChart().should('exist');
    getChoosePeriod().should('exist');

    const consumptionTab = getConsumptionTab().should('exist');
    consumptionTab.click();
    getConsumptionChart().should('exist');
    getNoData().should('not.exist');
    getError().should('not.exist');
  });

  it('should handle errors from metering points', () => {
    setup('metering-points-error');

    getError().should('exist');

    getChoosePeriod().should('not.exist');
    getConsumptionChart().should('not.exist');
    getConsumptionTab().should('not.exist');
    getNoData().should('not.exist');
    getProductionChart().should('not.exist');
    getProductionTab().should('not.exist');
  });

  // SHOULD HANDLE ERRORS FROM CERTIFICATES ...
});
