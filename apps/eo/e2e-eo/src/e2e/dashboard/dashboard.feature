Feature: Dashboard Page

  Background: The dashboard page is the first page a user gets to see after login, and it should have the most pressing
  items for a user to see, and then feel inclined to visit the rest of the pages to get more in-depth information.

  Scenario: "Frontend e2e test 1" can see components on the dashboard page
    Given I am logged in as Frontend e2e test 1
    When I am on the dashboard page
