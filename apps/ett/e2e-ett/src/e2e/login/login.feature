Feature: Login

  Background: When using the demo environment, we use an OIDC mock service to login, which provides us with logins
  based on personas. Currently we have Charlotte CSR, Thomas Tesla and Ivan Iværksætter. They should all potentially
  provide different mocked data, based on their production/consumption.

  Scenario: Login as Charlotte CSR is allowed
    Given I am on the login page
    When I see Charlotte CSRs login button and click it
#    Then I see the terms and I accept them
    And I can see the dashboard page

  Scenario: Login as Ivan Iværksætter is allowed
    Given I am on the login page
    When I see Ivan Iværksætters login button and click it
#    Then I see the terms and I accept them
    And I can see the dashboard page

  Scenario: Login as Peter Producent is allowed
    Given I am on the login page
    When I see Peter Producents login button and click it
#    Then I see the terms and I accept them
    And I can see the dashboard page
