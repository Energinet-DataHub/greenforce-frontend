Feature: Reports Page

  Background: The reports page is where users go to request reports and view their status.

  Scenario: Charlotte can see report page
    Given I am logged in as Charlotte CSR
    When I go to the reports page
    Then I should see the reports page

  Scenario: Charlotte can request a report
    Given I am logged in as Charlotte CSR
    When I go to the reports page
    And I request a report for "Charlotte's Report"
    Then I should see the report request confirmation
