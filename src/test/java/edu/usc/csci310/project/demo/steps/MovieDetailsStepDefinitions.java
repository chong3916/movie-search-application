package edu.usc.csci310.project.demo.steps;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static edu.usc.csci310.project.demo.steps.SearchStepDefinitions.searchGetDriver;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class MovieDetailsStepDefinitions {
    private WebDriver driver;

    @BeforeAll
    public static void beforeAll() {
        System.out.println("Setting Up Cucumber Driver");
        System.setProperty("webdriver.http.factory", "jdk-http-client");
        WebDriverManager.chromedriver().setup();
    }

    @Before
    public void before() {
        driver = searchGetDriver();
    }

    @And("I click a result")
    public void iClickAResult() throws InterruptedException {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        List<WebElement> link = driver.findElements(By.cssSelector("[id^='movieDetailLink']"));
        Thread.sleep(1000);
        link.get(0).click();
    }

    @Then("I should see the movie poster")
    public void iShouldSeeTheMoviePoster() {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        assertNotNull(driver.findElement(By.id("moviePoster")));
    }

    @And("I should see the movie title")
    public void iShouldSeeTheMovieTitle() {
        assertNotNull(driver.findElement(By.id("movieTitle")));
    }

    @And("I should see the movie overview")
    public void iShouldSeeTheMovieOverview() {
        assertNotNull(driver.findElement(By.id("overview")));
    }

    @And("I should see the movie release date")
    public void iShouldSeeTheMovieReleaseDate() {
        assertNotNull(driver.findElement(By.id("releaseDate")));
    }

    @And("I should see the movie genres")
    public void iShouldSeeTheMovieGenres() {
        assertNotNull(driver.findElement(By.id("genres")));
    }

    @And("I should see the movie production companies")
    public void iShouldSeeTheMovieProductionCompanies() {
        assertNotNull(driver.findElement(By.id("productionCompanies")));
    }

    @And("I should see the movie director")
    public void iShouldSeeTheMovieDirector() {
        assertNotNull(driver.findElement(By.id("director")));
    }

    @And("I should see the cast for the movie")
    public void iShouldSeeTheCastForTheMovie() {
        assertNotNull(driver.findElement(By.id("cast")));
    }

    @Given("I am on a search results page")
    public void iAmOnASearchResultsPage() {
        driver.get("https://localhost:8080/search/title/john+wick/null/null");
    }

    @After
    public void After() {
        driver.quit();
    }

    @And("I click the movie genre {string}")
    public void iClickTheMovieGenre(String arg0) {
        driver.findElement(By.id("genre" + arg0)).click();
    }

    @And("I click a actor")
    public void iClickAActor() throws InterruptedException {
        String scrollElementIntoMiddle = "var viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);"
                + "var elementTop = arguments[0].getBoundingClientRect().top;"
                + "window.scrollBy(0, elementTop-(viewPortHeight/2));";
        List<WebElement> link = driver.findElements(By.cssSelector("[id^='actorLink-']"));
        ((JavascriptExecutor) driver).executeScript(scrollElementIntoMiddle, link.get(0));
        Thread.sleep(2000);
        link.get(0).click();
    }

    @Then("I shouldn't see the movie overview")
    public void iShouldnTSeeTheMovieOverview() {
        List<WebElement> elements = driver.findElements(By.id("overview"));
        assertEquals(0, elements.size());
    }

    @When("I click a result again")
    public void iClickAResultAgain() throws InterruptedException {
        List<WebElement> link = driver.findElements(By.cssSelector("[id^='movieDetailLink']"));
        link.get(0).click();
        Thread.sleep(300);
    }
}
