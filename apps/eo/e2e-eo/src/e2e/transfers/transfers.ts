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
import { LandingPagePO, LoginPo, SharedPO } from '../../page-objects';
import { TransfersPo } from '../../page-objects/transfers.po';

const transfers = new TransfersPo();
const landingPage = new LandingPagePO();
const login = new LoginPo();
const shared = new SharedPO();

Given('I am logged in as Charlotte CSR', () => {
  landingPage.navigateTo();
  landingPage.clickLoginButton();
  login.clickCharlotteLogin();
});

When('I go to the transfers page', () => {
  shared.clickTransfersMenuItem();
  transfers.urlIsTransfersPage();
  transfers.headerIsVisible();
});

When('I click on the new transfer agreement button', () => {
  transfers.clickNewAgreementButton();
});

When(/^I enter details for receiver$/, function () {
  transfers.enterReceiverDetailsForNewAgreement();
});

When(/^I click on the Timeframe step$/, function () {
  transfers.clickTimeframeButton();
});

When(/^I click on the Invitation step$/, function () {
  transfers.clickInvitationButton();
});

When(/^I copy the link to the transfer agreement proposal$/, function () {
  transfers.copyLinkToTransferAgreementProposal();
});

When('I enter details for a transfer agreement', () => {
  transfers.enterDetailsForNewAgreement();
});

When('I can see a modal to create a new agreement', () => {
  transfers.newAgreementModalIsVisible();
});

Then('I can see a header text in the table card', () => transfers.cardHeaderIsVisible());

Then('I can see a table component', () => transfers.tableIsVisible());

Then('I can see the table has a paginator', () => transfers.paginatorIsVisible());

Then('I can see a button to create a new agreement', () => transfers.newAgreementButtonIsVisible());

Then('I can see the new agreement in the table on the transfers page', () =>
  transfers.newlyCreatedAgreementIsVisible()
);

Then('I can see the modal to create a new agreement has closed', () =>
  transfers.newAgreementModalIsNotOnScreen()
);

Then('I can close the new agreement modal', () => {
  transfers.clickCloseNewAgreementModalButton();
});
