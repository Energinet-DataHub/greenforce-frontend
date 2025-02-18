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
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPo, SharedPO } from '../../page-objects';
import { TransfersPo } from '../../page-objects/transfers.po';

const transfers = new TransfersPo();
const login = new LoginPo();
const shared = new SharedPO();

beforeEach(() => {
  cy.viewport(1080, 720);
});

Given('I am logged in as Charlotte CSR', () => {
  login.visit();
  login.clickCharlotteLogin();
  // TODO MASEP: Revisit when terms works
  // login.termsIsVisible();
  // login.checkAcceptingTerms();
  // login.acceptTerms();
});

When('I go to the transfers page', () => {
  shared.clickTransfersMenuItem();
  transfers.urlIsTransfersPage();
  transfers.headerIsVisible();
});

When('I click on the new transfer agreement button', () => {
  transfers.clickNewAgreementButton();
});

When(/^I click and select sender$/, function () {
  transfers.clickSenderField();
  transfers.selectSender();
});

When(/^I click and select receiver$/, function () {
  transfers.clickReceiverField();
  transfers.selectReceiver();
});

When(/^I click on the Timeframe step$/, function () {
  transfers.clickTimeframeButton();
});

When(/^I click on the Volume step$/, function () {
  transfers.clickVolumeButton();
});

When(/^I select the volume, match recipients consumption$/, function () {
  transfers.clickMatchReceiverConsumption();
});

When(/^I click on the Summary step$/, function () {
  transfers.clickSummaryButton();
});

When(/^I click on the create agreement button$/, function () {
  transfers.clickCreateAgreementButton();
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

When('I click the transfer agreements from POA expandable card', () => {
  transfers.clickTransferAgreementsFromPOAExpandableCard();
});

Then('I can see a header text in my own transfer agreements table card', () =>
  transfers.ownTransferAgreementCardHeaderIsVisible()
);

Then('I can see a header text in the transfer agreements from POA table card', () =>
  transfers.transferAgreementsFromPOACardHeaderIsVisible()
);

Then('I can see my own transfer agreements table component', () =>
  transfers.ownTransferAgreementTableIsVisible()
);

Then('I can see a transfer agreements from POA table component', () =>
  transfers.transferAgreementsFromPOATableIsVisible()
);

Then('I can not see a transfer agreements from POA table component', () =>
  transfers.transferAgreementsFromPOATableIsNotVisible()
);

Then('I can see my own transfer agreements table has a paginator', () =>
  transfers.ownTransferAgreementTablePaginatorIsVisible()
);

Then('I can see the transfer agreements from POA table has a paginator', () =>
  transfers.transferAgreementsFromPOATablePaginatorIsVisible()
);

Then('I can see my own transfer agreements expandable card', () =>
  transfers.ownTransferAgreementsExpandableCardIsVisible()
);

Then('I can see the transfer agreements from POA expandable card', () =>
  transfers.transferAgreementsFromPOAExpandableCardIsVisible()
);

Then('I can see a button to create a new agreement', () => transfers.newAgreementButtonIsVisible());

Then('I can see the modal to create a new agreement has closed', () =>
  transfers.newAgreementModalIsNotOnScreen()
);

Then('I can close the new agreement modal', () => {
  transfers.clickCloseNewAgreementModalButton();
});
