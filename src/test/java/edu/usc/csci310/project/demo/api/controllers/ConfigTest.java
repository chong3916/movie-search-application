package edu.usc.csci310.project.demo.api.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.web.client.RestTemplate;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

public class ConfigTest {

    @Test
    public void restTemplateTest() {
        RestTemplateBuilder rtb = mock(RestTemplateBuilder.class);
        when(rtb.build()).thenReturn(new RestTemplate());

        Config config = new Config();
        RestTemplate response = config.restTemplate(rtb);
        assertNotNull(response);
    }

}
