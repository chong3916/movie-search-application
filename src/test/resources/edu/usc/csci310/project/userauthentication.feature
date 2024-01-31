Feature: User signup and login
  Scenario: Valid user signup
    Given I am on the signup page
    When I enter in "jane doe" as the username
    And I enter in "password" as the password
    And I enter in "password" as the confirm password
    And I click the submit button
    Then I should see "Welcome to Movie Search!"

  Scenario: Valid user signup and login
    Given I am on the signup page
    When I enter in "jane doe" as the username
    And I enter in "password" as the password
    And I enter in "password" as the confirm password
    And I click the submit button
    Then I should see "Welcome to Movie Search!"
    When I am on the login page
    And I enter in "jane doe" as the username
    And I enter in "password" as the password
    And I click the login button
    Then I should see "Welcome to Movie Search!"

  Scenario: Valid user signup and login then timeout
    Given I am on the signup page
    When I enter in "jane doe" as the username
    And I enter in "password" as the password
    And I enter in "password" as the confirm password
    And I click the submit button
    Then I should see "Welcome to Movie Search!"
    When I am on the login page
    And I enter in "jane doe" as the username
    And I enter in "password" as the password
    And I click the login button
    Then I should see "Welcome to Movie Search!"
    When I click the view profile button
    And I wait 61 seconds
    Then I should see "Welcome to Movie Search!"

  Scenario: Valid user signup and 3 failed logins.
    Given I am on the signup page
    When I enter in "jane doe" as the username
    And I enter in "password" as the password
    And I enter in "password" as the confirm password
    And I click the submit button
    Then I should see "Welcome to Movie Search!"
    When I am on the login page
    And I enter in "jane doe" as the username
    And I enter in "pass" as the password
    And I click the login button
    And I enter in "jane doe" as the username
    And I enter in "pass" as the password
    And I click the login button
    And I enter in "jane doe" as the username
    And I enter in "pass" as the password
    And I click the login button
    Then I should see "Login Page"

  Scenario: Valid user signup and 3 failed logins then reset login successful.
    Given I am on the signup page
    When I enter in "jane doe" as the username
    And I enter in "password" as the password
    And I enter in "password" as the confirm password
    And I click the submit button
    Then I should see "Welcome to Movie Search!"
    When I am on the login page
    And I enter in "jane doe" as the username
    And I enter in "pass" as the password
    And I click the login button
    And I enter in "jane doe" as the username
    And I enter in "pass" as the password
    And I click the login button
    And I enter in "jane doe" as the username
    And I enter in "pass" as the password
    And I click the login button
    Then I should see "Login Page"
    And I wait 31 seconds
    And I enter in "jane doe" as the username
    And I enter in "password" as the password
    Then I should see "Welcome to Movie Search!"

  Scenario: Pages are not accessible without HTTPS
    Given I am on the signup page without HTTPS
    Then I should see "Bad Request"

  Scenario: Pages are accessible with HTTPS
    Given I am on the signup page
    Then I should see "Welcome to Movie Search!"

  Scenario: Pages are inaccessible without logging in
    Given I am on the login page
    And I type "Matrix" into the search box
    And I click the search submit button
    Then I should see "Please login to use application."
