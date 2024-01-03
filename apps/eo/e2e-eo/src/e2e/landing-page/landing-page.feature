Feature: Landing Page

  Background: The page everyone gets to see first, with basic information and buttons to login.

  Scenario: There is 1 'login' button available
    Given I am on the landing page
    Then I can see 1 login button

  Scenario: The page has a footer with content
    Given I am on the landing page
    Then I can see a footer with content in it
