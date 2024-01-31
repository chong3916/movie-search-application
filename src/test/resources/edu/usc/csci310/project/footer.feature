Feature: Footer
  Scenario: Check if footer is in the signup page
    Given I am on the signup page
    Then I should see "Team 18"

  Scenario: Check if footer is in the login page
    Given I am on the login page
    Then I should see "Team 18"

  Scenario: Check if footer is in the user page
    Given I am logged in as "userTestFooter"
    When I click the view profile button
    Then I should see "Team 18"

  Scenario: Check if footer is in the search home
    Given I am on the home page
    Then I should see "Team 18"

  Scenario: Check if footer is in the search result
    Given the user "userTest" is logged in
    When the user searches for a movie named "Titanic"
    Then the user should see "Team 18"

  Scenario: Check if the footer is in the montage page
    Given the user "userTest" is logged in
    When the user clicks the Profile link
    And the user clicks create new list
    And enters in "new list public" as the list name
    And sets list as public
    And clicks create new list button
    And the user clicks the list named "new list public"
    And the user clicks view montage
    Then the user should see "Team 18"

  Scenario: Check if the footer is in create a new watchlist page
    Given the user "userTest" is logged in
    When the user clicks the Profile link
    And the user clicks create new list
    Then the user should see "Team 18"

  Scenario: Check if the footer is in edit watchlist page.
    Given the user "userTest" is logged in
    When the user clicks the Profile link
    And the user clicks the list named "new list public"
    And the user clicks edit list button
    Then the user should see "Team 18"

  Scenario: Check if the footer is in private watchlist page
    Given the user "userTest1" is logged in
    When the user clicks the Profile link
    And the user clicks create new list
    And the user creates new list named "new list private"
    And the user clicks the list named "new list private"
    Then the user should see "Team 18"

  Scenario: Check if the footer is in private watchlist page
    Given the user "userTest1" is logged in
    When the user clicks the Profile link
    And the user clicks the list named "new list public"
    Then the user should see "Team 18"
