Feature: Language switcher on landing page

  Scenario: User changes language to Danish
    Given I open the landing page
    When I open the language switcher
    And I choose "Dansk" in the dropdown
    And I save the language selection
    Then the document language should be "da"


