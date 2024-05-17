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
import { endOfToday, format } from 'date-fns';

import { translocoProviders } from '@energinet-datahub/eo/globalization/configuration-localization';
import { danishDatetimeProviders } from '@energinet-datahub/watt/core/datetime';
import { danishLocalProviders } from '@energinet-datahub/gf/globalization/configuration-danish-locale';

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

const formattedLogEntries = [
  'System has created a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has created a metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has deactivated or changed the end date of the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has deactivated the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has accepted the transfer agreement from OTHER_ORGANIZATION_NAME (44332211) with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has created a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has activated the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has changed the end date of the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has accepted the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has activated the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has expired the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has deactivated the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has expired the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has accepted the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has deactivated the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has expired the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has activated the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has activated the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has changed the end date of the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has expired the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has accepted the transfer agreement from OTHER_ORGANIZATION_NAME (44332211) with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has created a proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has accepted the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has expired the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has deactivated the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has declined the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has created a proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has declined the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has deactivated or changed the end date of the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has deactivated the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has deactivated the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has activated the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has declined the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has changed the end date of the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has activated the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has expired the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has declined the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has declined the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has accepted the proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'System has changed the end date of the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has created a metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
  'ACTOR_NAME has declined the transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd',
];

describe('EO - Activity Log', () => {
  const findNoLogEntries = () => cy.findByText('No results found');
  const findAmountOfLogEntries = (amount: number) => cy.findByText(amount);
  const findErrorMessage = () => cy.findByText('An unexpected error occured');
  const findTransferLogEntry = () =>
    cy.findByText(
      'ACTOR_NAME has created a proposal of a transfer agreement with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd'
    );
  const findCertificateLogEntry = () =>
    cy.findByText(
      'ACTOR_NAME has activated the metering point with ID c4f0a4e6-5d9a-40a1-98e1-3ea822a501fd'
    );
  const findEventTypeFilter = () => cy.findByText('Event type');
  const findTransferEventTypeFilter = () =>
    cy.findByRole('option', { name: /Transfer agreement/i });
  const findCertificateEventTypeFilter = () => cy.findByRole('option', { name: /Metering point/i });
  const findTimestamps = () => cy.get('td.mat-column-timestamp');

  const amountOfTransferLogEntries = 28;
  const amountOfCertificatesLogEntries = 14;
  const totalLogEntries = amountOfTransferLogEntries + amountOfCertificatesLogEntries;

  function setup(activityLogScenario: ActivityLogScenario = {}) {
    cy.mount(EoActivityLogShellComponent, {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideNoopAnimations(),
        provideRouter([], withComponentInputBinding()),
        danishLocalProviders,
        danishDatetimeProviders,
        ...translocoProviders,
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
      findAmountOfLogEntries(amountOfCertificatesLogEntries).should('exist');
    });

    it('should handle no certificates log entries', () => {
      setup({ certificates: ConfigValue.NoLogEntries });
      findNoLogEntries().should('not.exist');
      findCertificateLogEntry().should('not.exist');
      findTransferLogEntry().should('exist');
      findAmountOfLogEntries(amountOfTransferLogEntries).should('exist');
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
    it('should format log entries correctly', () => {
      setup();
      formattedLogEntries.forEach((logEntry) => {
        cy.findByText(logEntry).should('exist');
      });
    });
  });

  it('should filter log entries', () => {
    setup();

    // DEFAULT - ALL LOG ENTRIES SHOULD BE VISIBLE
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(totalLogEntries).should('exist');
    findNoLogEntries().should('not.exist');
    findErrorMessage().should('not.exist');

    // OPEN FILTER
    findEventTypeFilter().should('exist').click();

    // TURN OFF TRANSFER LOG ENTRIES
    findTransferEventTypeFilter().click();
    findTransferLogEntry().should('not.exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(amountOfCertificatesLogEntries).should('exist');

    // TURN BACK ON TRANSFER LOG ENTRIES
    findTransferEventTypeFilter().click();
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(totalLogEntries).should('exist');

    // TURN OFF CERTIFICATE LOG ENTRIES
    findCertificateEventTypeFilter().click();
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('not.exist');
    findAmountOfLogEntries(amountOfTransferLogEntries).should('exist');

    // TURN BACK ON CERTIFICATE LOG ENTRIES
    findCertificateEventTypeFilter().click();
    findTransferLogEntry().should('exist');
    findCertificateLogEntry().should('exist');
    findAmountOfLogEntries(totalLogEntries).should('exist');

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
    const formattedDate = format(endOfToday(), 'dd-MMM yyyy HH:mm:ss');
    cy.findAllByText(formattedDate).should('exist');
  });

  it('should sort log entries by timestamp (newest first)', () => {
    setup();
    findTimestamps().then((timestamps) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedTimestamps = Array.from(timestamps).map((timestamp: any) =>
        new Date(timestamp.textContent).getTime()
      );

      mappedTimestamps.reverse().forEach((timestamp, index) => {
        if (index === timestamps.length - 1) return;
        cy.log(
          `Comparing ${new Date(timestamp)} to be less than or equal to ${new Date(
            mappedTimestamps[index + 1]
          )}`
        );
        cy.wrap(timestamp).should('be.lte', mappedTimestamps[index + 1]);
      });
    });
  });
});
