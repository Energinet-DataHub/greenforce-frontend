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
import { LoginPo, SharedPO } from '../../page-objects';
import { ReportsPo } from '../../page-objects/reports.po';
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const reports = new ReportsPo();
const login = new LoginPo();
const shared = new SharedPO();

beforeEach(() => {
  cy.viewport(1080, 720);
});

Given('I am logged in as Charlotte CSR', () => {
  login.visit();
  login.clickCharlotteLogin();
});

When('I go to the reports page', () => {
  shared.clickReportsMenuItem();
});

When('I request a report for "Charlotte\'s Report"', () => {
  reports.clickRequestButton();
  reports.clickModalStartRequestButton();
})

Then('I should see the reports page', () => {
  reports.urlIsReportsPage();
  reports.headerIsVisible();
  reports.requestButtonIsVisible();
  reports.tableIsVisible();
});

Then('I should see the report request confirmation', () => {
  reports.toastIsVisible();
});
