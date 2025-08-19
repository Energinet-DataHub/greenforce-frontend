Feature: Language Switcher

  Background:
    Given I am logged in as Charlotte CSR

  Scenario: User can open the language switcher and switch to Danish
    When I open the language switcher
    Then I should see the language dropdown
    When I choose "Danish" in the dropdown
    And I save the language selection
    Then the document language should be "da"
