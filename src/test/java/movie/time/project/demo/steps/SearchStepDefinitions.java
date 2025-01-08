package movie.time.project.demo.steps;

import static org.junit.jupiter.api.Assertions.assertNotNull;

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
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;

import java.util.concurrent.TimeUnit;

public class SearchStepDefinitions {
    private static final String ROOT_URL = "https://localhost:8080/";
    private static WebDriver driver;

    @BeforeAll
    public static void beforeAll() {
        System.out.println("Setting Up Cucumber Driver");
        System.setProperty("webdriver.http.factory", "jdk-http-client");
        WebDriverManager.chromedriver().setup();
    }

    @Before
    public void before() {
        ChromeOptions options = new ChromeOptions();

        options.addArguments("--headless");
        options.addArguments("--whitelisted-ips");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-extensions");
        options.addArguments("--verbose");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--window-size=1280,800");
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--allow-insecure-localhost");
        options.setAcceptInsecureCerts(true);
        driver = new ChromeDriver(options);
    }

    public static WebDriver searchGetDriver() {
        return driver;
    }

    @When("I enter in {string} as search term")
    public void iEnterInATitle(String arg0) {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.findElement(By.id("searchTerm")).sendKeys(arg0);
    }

    @And("I click submit search")
    public void iClickSubmitSearch() {
        WebElement submitButton = driver.findElement(By.id("submitButton"));
        submitButton.submit();
    }

    @Then("I should see the results")
    public void iShouldSeeTheResults() {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        assertNotNull(driver.findElements(By.cssSelector("[id*='movieBox']")));
    }

    @When("I choose actor as search category")
    public void iChooseActorAsSearchCategory() {
        Select categories = new Select(driver.findElement(By.id("searchCategory")));
        categories.selectByValue("actor");
    }

    @And("I click the filter button")
    public void iClickTheFilterButton() {
        driver.findElement(By.id("filter")).click();
    }

    @And("I enter in {string} as the start year")
    public void iEnterInAsTheStartYear(String arg0) {
        driver.findElement(By.id("yearStartFilter")).sendKeys(arg0);
    }

    @And("I enter in {string} as the end year")
    public void iEnterInAsTheEndYear(String arg0) {
        driver.findElement(By.id("yearEndFilter")).sendKeys(arg0);
    }

    @When("I click load more results")
    public void iClickLoadMoreResults() {
        driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
        WebElement button = driver.findElement(By.cssSelector("[id='loadMore']"));
        ((JavascriptExecutor)driver).executeScript("window.scrollTo(0,"+button.getLocation().y+")");
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", button);
    }

    @After
    public void After() {
        driver.quit();
    }

    @When("I choose {string} as search category")
    public void iChooseAsSearchCategory(String arg0) {
        Select categories = new Select(driver.findElement(By.id("searchCategory")));
        categories.selectByValue(arg0);
    }

    @Given("I am logged in")
    public void iAmLoggedIn() throws InterruptedException {
        driver.get(ROOT_URL + "signup");
        driver.findElement(By.id("username")).sendKeys("userSearch");
        driver.findElement(By.id("password")).sendKeys("password");
        driver.findElement(By.id("confirmPassword")).sendKeys("password");
        Thread.sleep(300);
        driver.findElement(By.id("submitSignUp")).click();
        driver.get(ROOT_URL + "login");
        driver.findElement(By.id("username")).sendKeys("userSearch");
        driver.findElement(By.id("password")).sendKeys("password");
        Thread.sleep(300);
        driver.findElement(By.id("submit")).click();
        Thread.sleep(1000);
    }

    @When("I search for {string}")
    public void iSearchFor(String arg0) throws InterruptedException {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.findElement(By.id("searchTerm")).sendKeys(arg0);
        Thread.sleep(300);
        driver.findElement(By.id("submitButton")).click();
    }
}
