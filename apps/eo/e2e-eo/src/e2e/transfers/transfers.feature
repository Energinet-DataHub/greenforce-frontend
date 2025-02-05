Feature: Transfers Page

  Background: The transfers page is where users go to see information about transfer agreements they have.

  Scenario: Charlotte CSR can see components on the transfers page
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    Then I can see a header text in my own transfer agreements table card
    And I can see my own transfer agreements expandable card
    And I can see my own transfer agreements table component
    And I can see my own transfer agreements table has a paginator
    And I can see a button to create a new agreement
    And I can see a header text in the transfer agreements from POA table card
    And I can not see a transfer agreements from POA table component
    And I can see the transfer agreements from POA expandable card
    When I click the transfer agreements from POA expandable card
    Then I can see a transfer agreements from POA table component
    And I can see the transfer agreements from POA table has a paginator

  Scenario: Charlotte CSR can create a new transfer agreement Proposal
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    And I click on the new transfer agreement button
    And I can see a modal to create a new agreement
    And I click on the Timeframe step
    And I enter details for a transfer agreement
    And I click on the Volume step
    And I click on the Summary step
    And I copy the link to the transfer agreement proposal

  Scenario: Charlotte CSR can create a new third party transfer agreement
    Given I am logged in as Charlotte CSR
    When I go to the transfers page
    And I click on the new transfer agreement button
    And I can see a modal to create a new agreement
    And I click and select sender
    And I click and select receiver
    And I click on the Timeframe step
    And I enter details for a transfer agreement
    And I click on the Volume step
    And I select the volume, match recipients consumption
    And I click on the Summary step
    And I click on the create agreement button
