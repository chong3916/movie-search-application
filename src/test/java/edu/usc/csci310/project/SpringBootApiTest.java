package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
public class SpringBootApiTest {

    @Test
    public void mainTest() {
        SpringBootAPI.main(new String[]{"--server.port=8081"});
        //If this assertion passes, the application successfully loaded
        assertTrue(true);
    }
    @Test
    public void redirectTest() {
        SpringBootAPI springBootAPI = new SpringBootAPI();
        String ret = springBootAPI.redirect();
        assertEquals(ret, "forward:/");
    }
}
