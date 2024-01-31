package edu.usc.csci310.project.demo.api.controllers;
import edu.usc.csci310.project.demo.api.responses.PersonResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/person")
// Controller to get person data from TMDB
public class PersonController {
    public PersonController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    // Get apiKey value from application.properties. Used to access TMDB
    @Value("${api.key}")
    private String apiKey;

    // Rest template instantiated in Config.java
    private RestTemplate restTemplate;

    @GetMapping("/{personID}") // map api url for fetch
    public ResponseEntity<PersonResponse> getPerson(@PathVariable("personID") String personID){
        try { // Try to get data from link
            // first param is link of database/api, second param is to convert json object to java object
            // make sure java object class has same variable names as json key in database, otherwise will not convert properly
            ResponseEntity<PersonResponse> responseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/person/" + personID + "?api_key=" + apiKey, PersonResponse.class
            );
            if(responseEntity.hasBody()) {
                PersonResponse response = responseEntity.getBody(); // get responseEntity body (which is Person object)
                return ResponseEntity.ok().body(response); // Return good response with results in body
            }
            return ResponseEntity.notFound().build();
        }
        catch(IllegalArgumentException e){  // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }
}
