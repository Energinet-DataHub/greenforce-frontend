Feature: Create transfer agreement

  Scenario: Charlotte CSR can create a new transfer agreement
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    And I click on the new transfer agreement button
    And I can see a modal to create a new agreement
    And I enter details for a transfer agreement
    And I click create transfer agreement
    And I can see the modal to create a new agreement has closed
    Then I can see the new agreement in the table on the transfers page
