import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { DashboardPo, LoginPo, SharedPO } from '../../page-objects';

const login = new LoginPo();
const shared = new SharedPO();
const dashboardPage = new DashboardPo();

Given('I am on the login page', () => {
  login.visit();
});

When('I see Charlotte CSRs login button and click it', () => {
  login.clickCharlotteLogin();
});

When("I see Thomas Tesla's login button and click it", () => {
  login.clickThomasLogin();
});

When('I see Ivan Iværksætters login button and click it', () => {
  login.clickIvanLogin();
});

When('I see Peter Producents login button and click it', () => {
  login.clickPeterLogin();
});

Then('I see the terms and I accept them', () => {
  login.termsIsVisible();
  login.checkAcceptingTerms();
  login.acceptTerms();
});

Then('I can see the dashboard page', () => {
  dashboardPage.headerIsVisible();
  shared.clickLogoutMenuItem();
});
