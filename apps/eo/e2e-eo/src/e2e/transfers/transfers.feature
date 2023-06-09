Feature: Transfers Page

  Background: The transfers page is where users go to see information about transfer agreements they have.

  Scenario: Charlotte CSR can see components on the transfers page
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    Then I can see a header text in the table card
    And I can see a table component
    And I can see the table has a paginator
    And I can see a download button
    And I can see a button to create a new agreement

  Scenario: Charlotte CSR can access a modal for creating new transfer agreement on the transfers page
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    And I click on the new transfer agreement button
    Then I can see a modal to create a new agreement
    And I can close the new agreement modal

  Scenario: Charlotte CSR can create a new transfer agreement
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    And I click on the new transfer agreement button
    And I can see a modal to create a new agreement
    And I enter details for a transfer agreement
    And I click create transfer agreement
    And I can see the modal to create a new agreement has closed
    Then I can see the new agreement in the table on the transfers page
