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

