Feature: Montage Page
  Scenario: Fewer than ten images available
    Given the user "user" is logged in
    When the user clicks the Profile link
    And the user clicks create new list
    And enters in "new list" as the list name
    And sets list as public
    And clicks create new list button
    And the user clicks the list named "new list"
    And the user clicks view montage
    Then the user sees not enough images error

  Scenario: Ten or more images available
    Given the user "user" is logged in
    When the user clicks the Profile link
    And the user clicks create new list
    And enters in "new list" as the list name
    And sets list as public
    And clicks create new list button
    And the user searches for a movie named "titanic"
    And the user clicks add movie button
    And the user clicks the list "new list" in add movie button
    And the user searches for a movie named "pulp fiction"
    And the user clicks add movie button
    And the user clicks the list "new list" in add movie button
    And the user searches for a movie named "inglorious basterds"
    And the user clicks add movie button
    And the user clicks the list "new list" in add movie button
    And the user searches for a movie named "the godfather"
    And the user clicks add movie button
    And the user clicks the list "new list" in add movie button
    And the user searches for a movie named "john wick"
    And the user clicks add movie button
    And the user clicks the list "new list" in add movie button
    And the user clicks the Profile link
    And the user clicks the list named "new list"
    And the user clicks view montage
    Then the user sees ten images
