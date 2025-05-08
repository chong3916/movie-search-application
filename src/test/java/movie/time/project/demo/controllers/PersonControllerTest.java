package movie.time.project.demo.controllers;
import movie.time.project.demo.api.controllers.PersonController;
import movie.time.project.demo.api.responses.PersonResponse;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;

public class PersonControllerTest {
    private RestTemplate restTemplate = mock(RestTemplate.class);
    private PersonController personController = new PersonController(restTemplate);

    @Test
    void personControllerGetPersonTest(){
        PersonResponse mockedResponse = new PersonResponse("test", "/test", "acting", "12345", null, null, 0);

        // Test when response is valid and has body
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedResponse, HttpStatus.OK));

        ResponseEntity<PersonResponse> response = personController.getPerson("12345"); // call getMovieList which returns mocked response
        assertEquals(mockedResponse.getPersonId(), response.getBody().getPersonId());

        // Test when response has nobody
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.OK));
        response = personController.getPerson("12345");
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when response is invalid
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenThrow(IllegalArgumentException.class);
        response = personController.getPerson("12345");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}

