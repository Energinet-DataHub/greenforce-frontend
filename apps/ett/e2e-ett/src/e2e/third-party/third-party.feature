Feature: Third-party Consent Management Flow

  Background:
    Given I am on the "Dexiflao" application homepage

  Scenario: CSR successfully accepts a consent request
    When I click on the button with text "start onboarding"
    Then I should be redirected to the OIDC mock login page
    When I click on the user with name "Charlotte CSR"
    Then I should see the consent management dialog
