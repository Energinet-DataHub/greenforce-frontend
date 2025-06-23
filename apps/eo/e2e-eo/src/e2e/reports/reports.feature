Feature: Reports Page

  Background: The reports page is where users go to request reports and view their status.

  Scenario: Charlotte can see report page
    Given I am logged in as Charlotte CSR
    When I go to the reports page
    Then I should see the reports page
