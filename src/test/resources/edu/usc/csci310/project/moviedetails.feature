Feature: Movie Details
  Scenario: Search movie and click for details
    Given I am logged in
    When I search for "Titanic"
    And I click a result
    Then I should see the movie poster
    And I should see the movie title
    And I should see the movie overview
    And I should see the movie release date
    And I should see the movie genres
    And I should see the movie production companies
    And I should see the movie director
    And I should see the cast for the movie
    When I click a result again
    Then I shouldn't see the movie overview

  Scenario: Search by genre on movie details page
    Given I am logged in
    When I search for "Titanic"
    And I click a result
    And I click the movie genre "Drama"
    Then I should see the results
    
  Scenario: Search by actor on movie details page
    Given I am logged in
    When I search for "Titanic"
    And I click a result
    And I click a actor
    Then I should see the results
