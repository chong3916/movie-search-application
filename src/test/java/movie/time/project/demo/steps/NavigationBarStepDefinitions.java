package movie.time.project.demo.steps;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public class NavigationBarStepDefinitions {

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
        options.addArguments("--start-maximized");
        options.setAcceptInsecureCerts(true);

        driver = new ChromeDriver(options);
    }

    public static WebDriver navbarGetDriver() {
        return driver;
    }

    @Given("the user is on the home page")
    public void the_user_is_on_the_home_page() {
        driver.get(ROOT_URL);
    }

    @Given("the user is on the login page")
    public void the_user_is_on_the_login_page() {
        driver.get(ROOT_URL + "login");
    }

    @Then("the user should see the navigation bar")
    public void the_user_should_see_the_navigation_bar() {
        WebElement navBar = driver.findElement(By.className("navbar"));
        assertTrue(navBar.isDisplayed());
    }

    @And("the navigation bar should have a Home link")
    public void the_navigation_bar_should_have_a_home_link() {
        WebElement homeLink = driver.findElement(By.id("navbarHome"));
        assertNotNull(homeLink);
    }

    @And("the navigation bar should have a Login link")
    public void the_navigation_bar_should_have_a_login_link() {
        WebElement loginLink = driver.findElement(By.id("navbarLogin"));
        assertNotNull(loginLink);
    }

    @And("the navigation bar should have a Profile link")
    public void the_navigation_bar_should_have_a_profile_link() {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        WebElement profileLink = driver.findElement(By.id("viewProfileLink"));
        assertNotNull(profileLink);
    }

    @When("the user clicks the Home link")
    public void the_user_clicks_the_home_link() {
        WebElement homeLink = driver.findElement(By.id("navbarHome"));
        homeLink.click();
    }

    @When("the user clicks the Login link")
    public void the_user_clicks_the_login_link() {
        WebElement loginLink = driver.findElement(By.id("navbarLogin"));
        loginLink.click();
    }

    @And("the user clicks the Profile link")
    public void the_user_clicks_the_profile_link() {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        WebElement profileLink = driver.findElement(By.id("viewProfileLink"));
        profileLink.click();

        try{
            driver.findElement(By.id("myListTitle"));
        }
        catch(Exception e){
            profileLink.click();
        }
    }

    @When("the user clicks the Logout button")
    public void theUserClicksTheLogoutButton() {
        WebElement logoutLink = driver.findElement(By.id("navbarLogout"));
        logoutLink.click();
    }

    @Then("the user should be redirected to the home page")
    public void the_user_should_be_redirected_to_the_home_page() {
        String actualUrl = driver.getCurrentUrl();
        assertEquals(ROOT_URL, actualUrl);
    }

    @Then("the user should be redirected to the login page")
    public void i_should_be_redirected_to_the_login_page() {
        String expectedUrl = ROOT_URL + "login";
        String actualUrl = driver.getCurrentUrl();
        assertEquals(expectedUrl, actualUrl);
    }

    @Then("the user should be redirected to the profile page")
    public void the_user_should_be_redirected_to_the_profile_page() {
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        String expectedUrl = ROOT_URL + "user";
        String actualUrl = driver.getCurrentUrl();
        assertEquals(expectedUrl, actualUrl);
    }

    @Given("the user {string} is logged in")
    public void the_user_is_logged_in(String arg0) throws InterruptedException {
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

    @Then("the user should see the logo")
    public void theUserShouldSeeTheLogo() {
        WebElement logo = driver.findElement(By.className("movie-time-logo"));
        assertNotNull(logo);
    }

    @After
    public void After() {
        driver.quit();
    }

    @Then("the user should see {string}")
    public void theUserShouldSee(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }
}
