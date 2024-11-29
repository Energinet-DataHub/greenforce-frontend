import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { DashboardPo, LoginPo } from '../../page-objects';

const dashboard = new DashboardPo();
const login = new LoginPo();

Given('I am logged in as Charlotte CSR', () => {
  login.visit();
  login.clickCharlotteLogin();
  login.termsIsVisible();
  login.checkAcceptingTerms();
  login.acceptTerms();
});

When('I am on the dashboard page', () => {
  dashboard.urlIsDashboardPage();
  dashboard.headerIsVisible();
});

Then('I can see my green consumption', () => dashboard.greenConsumptionIsVisible());
