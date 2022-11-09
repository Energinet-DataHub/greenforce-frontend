Feature: Login

  Background: When using the demo environment, we use an OIDC mock service to login, which provides us with logins
  based on personas. Currently we have Charlotte CSR, Thomas Tesla and Ivan Iværksætter. They should all potentially
  provide different mocked data, based on their production/consumption.

  Scenario: Login as Charlotte CSR is possible and sends user to dashboard page
    Given I am on the landing page
    When I click the start button to login
    When I see Charlotte CSRs login button and click it
    Then I can see the dashboard page

  Scenario: Login as Thomas Tesla is not possible and sends user to landing page
    Given I am on the landing page
    When I click the start button to login
    When I see Thomas Tesla's login button and click it
    Then I am on the landing page again with an error in the URL

  Scenario: Login as Ivan Iværksætter is possible and sends user to dashboard page
    Given I am on the landing page
    When I click the start button to login
    When I see Ivan Iværksætters login button and click it
    Then I can see the dashboard page
