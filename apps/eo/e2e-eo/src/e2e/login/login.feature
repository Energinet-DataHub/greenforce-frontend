Feature: Login

  Scenario: Using the mock OIDC login function
    Given I am on the landing page
    When I click the start button to login
    When I can see Charlotte CSRs login and click it
    Then I can see the dashboard page
