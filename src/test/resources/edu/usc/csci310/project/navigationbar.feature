Feature: Navigation bar
  Scenario: Logged out display
    Given the user is on the home page
    Then the user should see the navigation bar
    And the navigation bar should have a Home link
    And the navigation bar should have a Login link
    And the user should see the logo

  Scenario: User clicks on "Home" button
    Given the user is on the login page
    When the user clicks the Home link
    Then the user should be redirected to the home page

  Scenario: User clicks on "Login" button
    Given the user is on the home page
    When the user clicks the Login link
    Then the user should be redirected to the login page

  Scenario: Logged in display
    Given the user "user" is logged in
    Then the user should see the navigation bar
    And the navigation bar should have a Home link
    And the navigation bar should have a Profile link
    And the user should see the logo

  Scenario: User clicks on "View Profile" button
    Given the user "user" is logged in
    When the user clicks the Profile link
    Then the user should be redirected to the profile page

  Scenario: User clicks on "Logout" button
    Given the user "user" is logged in
    When the user clicks the Logout button
    Then the navigation bar should have a Login link
    And the user should be redirected to the login page
