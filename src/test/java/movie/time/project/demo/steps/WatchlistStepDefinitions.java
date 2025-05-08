package movie.time.project.demo.steps;

import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class WatchlistStepDefinitions {
    private WebDriver driver;

    @BeforeAll
    public static void beforeAll() {
        System.out.println("Setting Up Cucumber Driver");
        System.setProperty("webdriver.http.factory", "jdk-http-client");
        WebDriverManager.chromedriver().setup();
    }

    @Before
    public void before() {
        driver = NavigationBarStepDefinitions.navbarGetDriver(); // Get same driver from navigation bar step def
    }

    @And("the user clicks create new list")
    public void iClickCreateNewList() {
        driver.findElement(By.id("newListButton")).click();
    }

    @And("enters in {string} as the list name")
    public void iEnterInAsTheListName(String arg0) {
        WebElement element = driver.findElement(By.id("newListName"));
        element.sendKeys(arg0);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(1), Duration.ofSeconds(5));
        wait.until((ExpectedCondition<Boolean>) d -> (d.findElement(By.id("newListName")).getAttribute ("value").equals(arg0)));
    }

    @And("sets list as private")
    public void iSetListAsPrivate() {
        Select privacy = new Select(driver.findElement(By.id("listPrivacy")));
        privacy.selectByValue("private");
    }

    @Then("the user should see the list named {string}")
    public void iShouldSeeInTheUserPage(String arg0) {
        assertNotNull(driver.findElement(By.id("watchlistCard-" + arg0)));
    }

    @And("clicks create new list button")
    public void iCreateNewList() {
        driver.findElement(By.id("createNewListButton")).submit();
    }

    @When("the user searches for a movie named {string}")
    public void theUserSearchesForAMovieNamed(String arg0) throws InterruptedException {
        Select categories = new Select(driver.findElement(By.id("searchCategory")));
        categories.selectByValue("title");
        driver.findElement(By.id("searchTerm")).sendKeys(arg0);
        WebElement submitButton = driver.findElement(By.id("submitButton"));
        submitButton.submit();
        Thread.sleep(3000);
    }

    @And("the user clicks add movie button for {string}")
    public void theUserClicksAddMovieButton(String arg0) {
        WebElement l=driver.findElement(By.cssSelector("[id*='addMovieButton-" + arg0 + "']"));
        l.click();
    }

    @And("the user clicks create new list in add movie button")
    public void theUserClicksCreateNewListInAddMovieButton() {
        driver.findElement(By.id("addMovieCreateListButton")).click();
    }

    @And("the user clicks the list named {string}")
    public void theUserClicksTheListNamed(String arg0) throws InterruptedException {
        driver.findElement(By.id("watchlistCardLink-" + arg0)).click();
        Thread.sleep(1000);
    }


    @Then("the user should see the added movie")
    public void theUserShouldSeeTheAddedMovie() {
        WebElement l=driver.findElement(By.cssSelector("[id*='movieBox-']"));
        assertNotNull(l);
    }

    @And("the user clicks add movie button")
    public void theUserClicksAddMovieButton(){
        WebElement l=driver.findElement(By.cssSelector("[id*='addMovieButton-']"));
        l.click();
    }

    @And("the user creates new list named {string}")
    public void theUserCreatesNewListNamed(String arg0) throws InterruptedException {
        driver.findElement(By.id("newListName")).sendKeys(arg0);
        Thread.sleep(100);
        driver.findElement(By.id("createNewListButton")).submit();
    }

    @And("the user clicks remove movie button")
    public void theUserClicksRemoveMovieButton() throws InterruptedException {
        Thread.sleep(500);
        List<WebElement> l=driver.findElements(By.cssSelector("[id^='removeMovieButton-']"));
        l.get(0).click();
    }

    @Then("the user should see empty movie list")
    public void theUserShouldSeeEmptyMovieList() throws InterruptedException {
        Thread.sleep(1000);
        assertEquals(0, driver.findElements(By.cssSelector("[id*='movieBox-']")).size());
    }

    @And("the user clicks generate recommendations button")
    public void theUserClicksGenerateRecommendationsButton() {
        driver.findElement(By.id("recommendationsButton")).click();
    }

    @And("the user enters {string} as number of movies to recommend")
    public void theUserEntersAsNumberOfMoviesToRecommend(String arg0) {
        driver.findElement(By.id("recommendationNum")).sendKeys(arg0);
    }

    @And("the user clicks {string} as list to base recommendations on")
    public void theUserClicksAsListToBaseRecommendationsOn(String arg0) {
        driver.findElement(By.id("recommendationCheck-" + arg0)).click();
    }

    @And("the user clicks generate recommendations submit button")
    public void theUserClicksGenerateRecommendationsSubmitButton() {
        driver.findElement(By.id("recommendationsSubmit")).click();
    }

    @And("the user clicks create new list from recommendations")
    public void theUserClicksCreateNewListFromRecommendations() throws InterruptedException {
        String scrollElementIntoMiddle = "var viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);"
                + "var elementTop = arguments[0].getBoundingClientRect().top;"
                + "window.scrollBy(0, elementTop-(viewPortHeight/2));";

        WebElement element = driver.findElement(By.id("recommendationsNewListButton"));

        ((JavascriptExecutor) driver).executeScript(scrollElementIntoMiddle, element); // scroll to recommendations list button
        Thread.sleep(2000);

        element.click();
    }

    @And("the user clicks edit list button")
    public void theUserClicksEditListButton() {
        WebElement element = driver.findElement(By.id("editListButton"));
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(1), Duration.ofSeconds(5));
        wait.until(ExpectedConditions.elementToBeClickable(element));
        element.click();
    }

    @And("sets list as public")
    public void setsListAsPublic() throws InterruptedException {
        Select privacy = new Select(driver.findElement(By.id("listPrivacy")));
        privacy.selectByValue("public");
        Thread.sleep(100);
    }


    @And("the user confirms edit list changes")
    public void theUserConfirmsEditListChanges() {
        WebElement element = driver.findElement(By.id("saveListEdit"));
        element.submit();
    }

    @And("edits list name to {string}")
    public void editsListNameTo(String arg0) throws InterruptedException {
        WebElement element = driver.findElement(By.id("listName"));
        element.clear();
        element.sendKeys(arg0);
        Thread.sleep(1000);
    }

    @Then("list should be named {string}")
    public void listShouldBeNamed(String arg0) {
        List<WebElement> list = driver.findElements(By.xpath("//*[contains(text(),'" + arg0 + "')]"));
        assertTrue(list.size() > 0);
    }

    @And("the user clicks move movie button")
    public void theUserClicksMoveMovieButton() throws InterruptedException {
        Thread.sleep(500);
        List<WebElement> l=driver.findElements(By.cssSelector("[id^='moveMovieButton-']"));
        l.get(0).click();
    }

    @And("the user selects to move movie to {string}")
    public void theUserSelectsToMoveMovieTo(String arg0) throws InterruptedException {
        WebElement element = driver.findElement(By.cssSelector("[id*='moveMovieListButton-" + arg0 + "']"));
        element.click();
        Thread.sleep(1000);
    }

    @Then("the user should see {int} movies in list")
    public void theUserShouldSeeMoviesInList(int arg0) throws InterruptedException {
        Thread.sleep(1000);
        assertEquals(arg0, driver.findElements(By.cssSelector("[id*='movieBox-']")).size());
    }

    @And("clicks to move movie to list {string}")
    public void clicksToMoveMovieToList(String arg0) {
        WebElement element = driver.findElement(By.cssSelector("[id*='moveMovieListButton-" + arg0 + "']"));
        element.click();
    }

    @And("the user clicks the compare list button")
    public void theUserClicksTheCompareListButton(){
        driver.findElement(By.id("compareListButton")).click();
        //Thread.sleep(300);
    }

    @And("the user clicks the {string} comparison list button")
    public void theUserClicksTheComparisonListButton(String arg0){
        WebElement element = driver.findElement(By.cssSelector("[id*='comparisonListButton-" + arg0 + "']"));
        element.click();
    }

    @And("the user clicks create comparison list button")
    public void theUserClicksCreateComparisonListButton() {
        driver.findElement(By.id("comparisonNewListButton")).click();
    }

    @And("the user clicks see movie lists button")
    public void theUserClicksSeeMovieListsButton() {
        WebElement element = driver.findElement(By.cssSelector("[id*='seeMovieListsButton-']"));
        element.click();
    }

    @Then("the user should see {int} check marks")
    public void theUserShouldSeeCheckMarks(int arg0) {
        List<WebElement> elements = driver.findElements(By.cssSelector("[id*='checkMark']"));
        assertEquals(arg0, elements.size());
    }

    @And("the user clicks free movie tickets button")
    public void theUserClicksFreeMovieTicketsButton() {
        WebElement element = driver.findElement(By.cssSelector("[id*='freeTicketButton-']"));
        element.click();
    }


    @Then("the user should see popup stating user received free tickets")
    public void theUserShouldSeePopupStatingUserReceivedFreeTickets() {
        List<WebElement> elements = driver.findElements(By.cssSelector("[id*='freeTicketPopupMessage']"));
        assertEquals(1, elements.size());
    }

    @And("the user clicks delete list button for {string}")
    public void theUserClicksDeleteListButtonFor(String arg0) {
        driver.findElement(By.id("deleteListButton-" + arg0)).click();
    }

    @And("the user clicks confirm deleting list")
    public void theUserClicksConfirmDeletingList() throws InterruptedException {
        driver.findElement(By.id("deleteListConfirmButton")).click();
        Thread.sleep(500);
    }

    @Then("the user should not see list named {string}")
    public void theUserShouldNotSeeListNamed(String arg0) {
        List<WebElement> elements = driver.findElements(By.id("watchlistCardLink-" + arg0));
        assertEquals(0, elements.size());
    }

    @And("the user clicks view montage")
    public void theUserClicksViewMontage() {
        driver.findElement(By.id("view-montage-link")).click();
    }

    @Then("the user sees not enough images error")
    public void theUserSeesNotEnoughImagesError() {
        String errorMessage = driver.findElement(By.id("watchlist-montage-error")).getText();
        assertEquals("Error: cannot load ten or more images for montage.", errorMessage);
    }

    @And("the user clicks the list {string} in add movie button")
    public void theUserClicksTheListInAddMovieButton(String movieTitle) {
        driver.findElement(By.id("addMovieListButton-" + movieTitle)).click();
    }

    @Then("the user sees ten images")
    public void theUserSeesTenImages() {
        assertEquals(10,driver.findElements(By.cssSelector("[alt='Movie Image']")).size());
    }
}
