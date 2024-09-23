Feature: Search Movie
  Scenario: Enter movie key term and press submit
    Given I am logged in
    When I enter in "Titanic" as search term
    And I click submit search
    Then I should see the results

  Scenario: Search by actor name, press submit, and load more results
    Given I am logged in
    When I choose "actor" as search category
    And I enter in "Keanu Reeves" as search term
    And I click submit search
    Then I should see the results
    When I click load more results
    Then I should see the results

  Scenario: Enter movie key term with year filter and press submit
    Given I am logged in
    When I choose "title" as search category
    And I enter in "John Wick" as search term
    And I click the filter button
    And I enter in "2012" as the start year
    And I enter in "2013" as the end year
    And I click submit search
    Then I should see the results
