Feature: Dashboard Page

  Background: The dashboard page is the first page a user gets to see after login, and it should have the most pressing
  items for a user to see, and then feel inclined to visit the rest of the pages to get more in-depth information.

  Scenario: Charlotte CSR can see components on the dashboard page
    Given I am logged in as Charlotte CSR
    When I am on the dashboard page
