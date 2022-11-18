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
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
  DashboardPo,
  LandingPagePO,
  LoginPo,
  SharedPO,
} from '../../page-objects';

const dashboard = new DashboardPo();
const landingPage = new LandingPagePO();
const login = new LoginPo();
const shared = new SharedPO();

Given('I am logged in as Charlotte CSR', () => {
  landingPage.navigateTo();
  shared.clickOnlyNecessaryButton(); // To get rid of Cookie Consent banner
  landingPage.clickStartButtonByIndex(0);
  login.clickCharlotteLogin();
});

When('I am on the dashboard page', () => {
  dashboard.urlIsDashboardPage();
  dashboard.headerIsVisible();
});

Then('I can see the a pie-chart component', () => {
  dashboard.pieChartIsVisible();
});

Then('I can see an emissions data component', () => {
  dashboard.emissionCardIsVisible();
});

Then('I can see an hourly declaration component', () => {
  dashboard.hourlyDeclarationIsVisible();
});

Then('I can see a link collection component', () => {
  dashboard.linkCollectionIsVisible();
  dashboard.linkCollectionHasAmount(4);
});

Then('I can see a component for exporting data for CSR', () => {
  dashboard.exportDataCardIsVisible();
});
