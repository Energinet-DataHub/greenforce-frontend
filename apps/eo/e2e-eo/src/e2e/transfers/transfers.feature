Feature: Transfers Page

  Background: The transfers page is where users go to see information about transfer agreements they have.

  Scenario: Charlotte CSR can see components on the transfers page
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    Then I can see a header text in the table card
    And I can see a table component
    And I can see the table has a paginator
    And I can see a button to create a new agreement

  Scenario: Charlotte CSR has no transfer agreements
      Given I am logged in as Charlotte CSR
      When I go to the transfers page
      And I don't have any existing transfer agreements
      Then I can see a message that I have no transfer agreements
      And I see no loading indicators
      And I see no errors

  Scenario: Fetching transfer agreements fails
      Given I am logged in as Charlotte CSR
      And the API for transfer agreements is down
      When I go to the transfers page
      Then I can see a general error message
      And I see no loading indicators
