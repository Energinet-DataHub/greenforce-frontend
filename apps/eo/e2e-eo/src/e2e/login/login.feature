Feature: Login

  Background: When using the demo environment, we use an OIDC mock service to login, which provides us with logins
  based on personas. We use "Frontend e2e test 1" and "Frontend e2e test 2" as e2e personas.

  Scenario: Login as "Frontend e2e test 1" is allowed
    Given I am on the login page
    When I see "Frontend e2e test 1"s login button and click it
#    Then I see the terms and I accept them
    And I can see the dashboard page

  Scenario: Login as "Frontend e2e test 2" is allowed
    Given I am on the login page
    When I see "Frontend e2e test 2"s login button and click it
#    Then I see the terms and I accept them
    And I can see the dashboard page
