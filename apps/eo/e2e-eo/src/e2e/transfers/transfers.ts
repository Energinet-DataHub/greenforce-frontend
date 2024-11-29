import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPo, SharedPO } from '../../page-objects';
import { TransfersPo } from '../../page-objects/transfers.po';

const transfers = new TransfersPo();
const login = new LoginPo();
const shared = new SharedPO();

Given('I am logged in as Charlotte CSR', () => {
  login.visit();
  login.clickCharlotteLogin();
  login.termsIsVisible();
  login.checkAcceptingTerms();
  login.acceptTerms();
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
