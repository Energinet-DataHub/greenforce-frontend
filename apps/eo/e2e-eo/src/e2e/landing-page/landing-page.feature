Feature: Landing Page

  Background: The page everyone gets to see first, with basic information and buttons to login.

  Scenario: A cookie consent popup is available for the user
    Given I am on the landing page
    Then I can see a cookie consent popup

  Scenario: Clicking a button in cookie consent popup closes it
    Given I am on the landing page
    When I click the 'only necessary' button
    Then The popup closes

  Scenario: There are 3 'start button's available
    Given I am on the landing page
    Then I can see 3 start buttons

  Scenario: The page has a footer with content
    Given I am on the landing page
    Then I can see a footer with content in it
