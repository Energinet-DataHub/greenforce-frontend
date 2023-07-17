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
import { LandingPagePO, LoginPo, SharedPO } from '../../../page-objects';
import { TransfersPo } from '../../../page-objects/transfers.po';

const transfers = new TransfersPo();
const landingPage = new LandingPagePO();
const login = new LoginPo();
const shared = new SharedPO();

Given('I am logged in as Charlotte CSR', () => {
  landingPage.navigateTo();
  shared.clickOnlyNecessaryButton(); // To get rid of Cookie Consent banner
  landingPage.clickLoginButton();
  login.clickCharlotteLogin();
});

When('I go to the transfers page', () => {
  shared.clickTransfersMenuItem();
  transfers.urlIsTransfersPage();
  transfers.headerIsVisible();
});

When('the API for transfer agreements is down', () => {
  cy.intercept('GET', 'https://demo.energioprindelse.dk/api/transfer-agreements', {
    statusCode: 500
  });
});

When("I don't have any existing transfer agreements", () => {
  cy.intercept('GET', 'https://demo.energioprindelse.dk/api/transfer-agreements', {
    statusCode: 204,
  });
});

Then('I can see a header text in the table card', () => transfers.cardHeaderIsVisible());

Then('I can see a table component', () => transfers.tableIsVisible());

Then('I can see the table has a paginator', () => transfers.paginatorIsVisible());

Then('I can see a button to create a new agreement', () => transfers.newAgreementButtonIsVisible());

Then('I can see a message that I have no transfer agreements', () => {
  transfers.noTransferAgreementsTextIsVisible();
});

Then('I see no loading indicators', () => {
  transfers.loadingTransferAgreementsIndicatorIsNotVisible();
});

Then('I can see a general error message', () => {
  transfers.generalErrorIsVisible();
});

Then('I see no errors', () => {
  transfers.generalErrorIsNotVisible();
});


