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
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { danishLocalProviders } from '@energinet-datahub/gf/configuration-danish-locale';

import { EoActivityLogShellComponent } from './eo-activity-log-shell.component';

const transferActivityLogConfigKey = 'transfer-activity-log';
const certificatesActivityLogConfigKey = 'certificates-activity-log';

const enum ConfigValue {
  NoLogEntries = 'no-log-entries',
  ActivityLogHasError = 'activity-log-has-error',
}

interface ActivityLogScenario {
  transfer?: ConfigValue;
  certificates?: ConfigValue;
}

describe('EO - Activity Log', () => {
  const findNoLogEntries = () => cy.findByText('No results found');
  const findAmountOfLogEntries = (amount: number) => cy.findByText(amount);
  const findErrorMessage = () => cy.findByText('An unexpected error occured');
  const findTransferLogEntry = () =>
    cy.findByText(
      'ORGANIZATION_NAME (11223344) has created a proposal of a transfer agreement with ID 9475a256-d71e-4d59-97a8-01875d05e3fe'
    );
  const findCertificateLogEntry = () =>
    cy.findByText(
      'ORGANIZATION_NAME (11223344) has activated the metering point with ID 00a01f0e-92f0-46ba-8c4c-88f47bd5dea5'
    );
  const findEventTypeFilter = () => cy.findByText('Event type');
  const findTransferEventTypeFilter = () =>
    cy.findByRole('option', { name: /Transfer agreement/i });
  const findCertificateEventTypeFilter = () => cy.findByRole('option', { name: /Metering point/i });
  const findCorrectlyFormattedTimestamp = () => cy.findByText('07-Feb-2024 14:12:21');

  function setup(activityLogScenario: ActivityLogScenario = {}) {
    cy.mount(EoActivityLogShellComponent, {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideNoopAnimations(),
        provideRouter([], withComponentInputBinding()),
        danishLocalProviders,
        danishDatetimeProviders,
      ],
    });

    if (activityLogScenario.transfer) {
      localStorage.setItem(transferActivityLogConfigKey, activityLogScenario.transfer);
    }

    if (activityLogScenario.certificates) {
      localStorage.setItem(certificatesActivityLogConfigKey, activityLogScenario.certificates);
    }
  }

  describe('No log entries', () => {
    it('should handle no log entries', () => {
      setup({ transfer: ConfigValue.NoLogEntries, certificates: ConfigValue.NoLogEntries });
      findNoLogEntries().should('exist');
      findAmountOfLogEntries(0).should('exist');
    });

    it('should handle no transfer log entries', () => {
      setup({ transfer: ConfigValue.NoLogEntries });
      findNoLogEntries().should('not.exist');
      findTransferLogEntry().should('not.exist');
      findCertificateLogEntry().should('exist');
      findAmountOfLogEntries(12).should('exist');
    });

    it('should handle no certificates log entries', () => {
      setup({ certificates: ConfigValue.NoLogEntries });
      findNoLogEntries().should('not.exist');
      findCertificateLogEntry().should('not.exist');
      findTransferLogEntry().should('exist');
      findAmountOfLogEntries(7).should('exist');
    });
  });

  describe('Error handling', () => {
    it('should show error if transfer log has error', () => {
      setup({ transfer: ConfigValue.ActivityLogHasError });
      findNoLogEntries().should('not.exist');
      findTransferLogEntry().should('not.exist');
      findCertificateLogEntry().should('not.exist');
      findErrorMessage().should('exist');
      findAmountOfLogEntries(0).should('exist');
    });

    it('should show error if certificates log has error', () => {
      setup({ certificates: ConfigValue.ActivityLogHasError });
      findNoLogEntries().should('not.exist');
      findTransferLogEntry().should('not.exist');
      findCertificateLogEntry().should('not.exist');
      findErrorMessage().should('exist');
      findAmountOfLogEntries(0).should('exist');
    });

    it('should show error if both transfer and certificates log has error', () => {
      setup({
        transfer: ConfigValue.ActivityLogHasError,
        certificates: ConfigValue.ActivityLogHasError,
      });
      findNoLogEntries().should('not.exist');
      findTransferLogEntry().should('not.exist');
      findCertificateLogEntry().should('not.exist');
      findErrorMessage().should('exist');
      findAmountOfLogEntries(0).should('exist');
    });
  });

  describe('Message formatting', () => {
    it('should format transfer log entry', () => {
      setup();
      findTransferLogEntry().should('exist');
    });
  });

  it('should filter log entries', () => {
    setup();

    // DEFAULT - ALL LOG ENTRIES SHOULD BE VISIBLE
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(19).should('exist');
    findNoLogEntries().should('not.exist');
    findErrorMessage().should('not.exist');

    // OPEN FILTER
    findEventTypeFilter().should('exist').click();

    // TURN OFF TRANSFER LOG ENTRIES
    findTransferEventTypeFilter().click();
    findTransferLogEntry().should('not.exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(12).should('exist');

    // TURN BACK ON TRANSFER LOG ENTRIES
    findTransferEventTypeFilter().click();
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(19).should('exist');

    // TURN OFF CERTIFICATE LOG ENTRIES
    findCertificateEventTypeFilter().click();
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('not.exist');
    findAmountOfLogEntries(7).should('exist');

    // TURN BACK ON CERTIFICATE LOG ENTRIES
    findCertificateEventTypeFilter().click();
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(19).should('exist');

    // TURN OFF ALL LOG ENTRIES
    findTransferEventTypeFilter().click();
    findCertificateEventTypeFilter().click();
    findTransferLogEntry().should('not.exist');
    findCertificateLogEntry().should('not.exist');
    findNoLogEntries().should('exist');
    findAmountOfLogEntries(0).should('exist');
  });

  it('should show correctly formatted timestamps', () => {
    setup();
    findCorrectlyFormattedTimestamp().should('exist');
  });
});
