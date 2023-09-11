Feature: Connections Page

  Background: The connections page is where users go to manage their connections.

  Scenario: Charlotte CSR can create a new invitation
    Given I am logged in as Charlotte CSR
    When I go to the connections page
    And I click on the "new invitation" button
    Then I can see a invitation link
    And I have a button which copies the invitation link
