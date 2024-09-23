package movie.time.project.demo.steps;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public class UserAuthenticationStepDefinitions {

    private static final String ROOT_URL = "https://localhost:8080/";
    private WebDriver driver;

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

    @When("I enter in {string} as the username")
    public void iEnterInAsTheUsername(String arg0) {
        driver.findElement(By.id("username")).sendKeys(arg0);
    }

    @And("I click the login button")
    public void iClickTheLoginButton() throws InterruptedException {
        Thread.sleep(300);
        driver.findElement(By.id("submit")).submit();
    }

    @Then("I should see {string}")
    public void iShouldSee(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I enter in {string} as the password")
    public void iEnterInAsThePassword(String arg0) {
        driver.findElement(By.id("password")).sendKeys(arg0);
    }

    @And("I click the submit button")
    public void iClickTheSubmitButton() throws InterruptedException {
        //driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        Thread.sleep(300);
        driver.findElement(By.id("submitSignUp")).submit();
    }

    @Given("I am on the signup page")
    public void iAmOnTheSignupPage() {
        driver.get(ROOT_URL + "signup");
    }

    @When("I am on the login page")
    public void iAmOnTheLoginPage() {
        driver.get(ROOT_URL + "login");
    }

    @When("I am on the home page")
    public void iAmOnTheHomePage() {
        driver.get(ROOT_URL);
    }

    @After
    public void After() {
        driver.quit();
    }

    @And("I enter in {string} as the confirm password")
    public void iEnterInAsTheConfirmPassword(String arg0) {
        driver.findElement(By.id("confirmPassword")).sendKeys(arg0);
    }

    @And("I wait {int} seconds")
    public void iWaitSeconds(int seconds) throws InterruptedException {
        Thread.sleep(seconds * 1000);
    }

    @And("I click the view profile button")
    public void iClickTheViewProfileButton() {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        WebElement profileLink = driver.findElement(By.id("viewProfileLink"));
        profileLink.click();
    }

    @Given("I am on the user page")
    public void iAmOnTheUserPage() {
        driver.get(ROOT_URL + "user");
    }

    @Given("I am logged in as {string}")
    public void iAmLoggedInAs(String arg0) throws InterruptedException {
        driver.get(ROOT_URL + "signup");
        driver.findElement(By.id("username")).sendKeys(arg0);
        driver.findElement(By.id("password")).sendKeys("password");
        driver.findElement(By.id("confirmPassword")).sendKeys("password");
        Thread.sleep(300);
        driver.findElement(By.id("submitSignUp")).click();
        driver.get(ROOT_URL + "login");
        driver.findElement(By.id("username")).sendKeys(arg0);
        driver.findElement(By.id("password")).sendKeys("password");
        Thread.sleep(300);
        driver.findElement(By.id("submit")).click();
        Thread.sleep(1000);
    }
    
    @And("I type {string} into the search box")
    public void iTypeIntoTheSearchBox(String s) {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.findElement(By.id("searchTerm")).sendKeys(s);
    }

    @And("I click the search submit button")
    public void iClickSubmitSearch() {
        WebElement submitButton = driver.findElement(By.id("submitButton"));
        submitButton.submit();
    }

    @Given("I am on the signup page without HTTPS")
    public void iAmOnTheSignupPageWithoutHTTPS() {
        driver.get("http://localhost:8080/signup");
    }
}
