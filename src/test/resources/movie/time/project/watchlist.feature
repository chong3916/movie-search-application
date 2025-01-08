Feature: Watchlist
  Scenario: Create new list
    Given the user "user1" is logged in
    When the user clicks the Profile link
    And the user clicks create new list
    And enters in "new list" as the list name
    And sets list as private
    And clicks create new list button
    Then the user should see the list named "new list"

  Scenario: Add movie to list
    Given the user "user1" is logged in
    When the user searches for a movie named "titanic"
    And the user clicks add movie button
    And the user clicks create new list in add movie button
    And the user creates new list named "new list1"
    And the user clicks the Profile link
    And the user clicks the list named "new list1"
    Then the user should see 1 movies in list

  Scenario: Generate recommendations from list and create new list
    Given the user "user1" is logged in
    When the user clicks the Profile link
    And the user clicks generate recommendations button
    And the user enters "2" as number of movies to recommend
    And the user clicks "new list1" as list to base recommendations on
    And the user clicks generate recommendations submit button
    And the user clicks create new list from recommendations
    And enters in "recommendations list" as the list name
    And clicks create new list button
    Then the user should see the list named "recommendations list"

  Scenario: Edit existing list name and privacy setting
    Given the user "user1" is logged in
    When the user clicks the Profile link
    And the user clicks the list named "new list1"
    And the user clicks edit list button
    And sets list as public
    And edits list name to "new list3"
    And the user confirms edit list changes
    Then list should be named "new list3"

  Scenario: Move movie from list to empty list
    Given the user "user1" is logged in
    When the user clicks the Profile link
    And the user clicks the list named "recommendations list"
    And the user clicks move movie button
    And clicks to move movie to list "new list"
    And the user clicks the Profile link
    And the user clicks the list named "new list"
    Then the user should see 1 movies in list

  Scenario: Remove movie from list
    Given the user "user1" is logged in
    When the user clicks the Profile link
    And the user clicks the list named "new list"
    And the user clicks remove movie button
    And the user clicks the Profile link
    And the user clicks the list named "new list"
    Then the user should see 0 movies in list

  Scenario: Copy movie from list to empty list
    Given the user "user1" is logged in
    When the user clicks the Profile link
    And the user clicks the list named "recommendations list"
    And the user clicks move movie button
    And clicks to move movie to list "new list"
    And the user clicks the Profile link
    And the user clicks the list named "new list"
    Then the user should see 1 movies in list

  Scenario: Compare with public list and create comparison list
    Given the user "user2" is logged in
    When the user searches for a movie named "titanic"
    And the user clicks add movie button
    And the user clicks create new list in add movie button
    And the user creates new list named "user2 new list"
    And the user clicks the Profile link
    And the user clicks the list named "new list3"
    And the user clicks the compare list button
    And the user clicks the "user2 new list" comparison list button
    And the user clicks create comparison list button
    And the user clicks the list named "A: user2 new list B: new list3"
    Then the user should see 1 movies in list

  Scenario: See list button shows lists movie is in
    Given the user "user2" is logged in
    When the user searches for a movie named "titanic"
    And the user clicks see movie lists button
    Then the user should see 2 check marks

  Scenario: Receive free tickets for movie
    Given the user "user2" is logged in
    When the user searches for a movie named "titanic"
    And the user clicks free movie tickets button
    Then the user should see popup stating user received free tickets

  Scenario: Delete list
    Given the user "user2" is logged in
    When the user clicks the Profile link
    And the user clicks delete list button for "user2 new list"
    And the user clicks confirm deleting list
    Then the user should not see list named "user2 new list"
