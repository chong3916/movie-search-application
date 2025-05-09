package movie.time.project.demo.controllers;
import movie.time.project.demo.api.requests.RecommendationsRequest;
import movie.time.project.demo.api.controllers.MovieController;
import movie.time.project.demo.api.responses.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
public class MovieControllerTest {
    private RestTemplate restTemplate = mock(RestTemplate.class);
    private MovieController movieController = new MovieController(restTemplate);

    @Test
    void movieControllerGetMovieDetailTest(){
        MovieResponse mockedResponse = new MovieResponse("overview", "title", "12345", "/test", null, null, "2023-01-01", null, null, "/test", 1);

        GenreResponse genreResponse = new GenreResponse("12", "thriller");

        GenreResponse[] genres = {genreResponse};
        mockedResponse.setGenres(genres);

        ProductionCompaniesResponse productionCompaniesResponse= new ProductionCompaniesResponse("10", "Walt Disney");
        ProductionCompaniesResponse[] productionCompanies = {productionCompaniesResponse};
        mockedResponse.setProductionCompanies(productionCompanies);

        PersonResponse personResponse = new PersonResponse("person", "/test", "acting", "12345", "character", null, 10);
        PersonResponse personDirectorResponse = new PersonResponse("person", "/test", "directing", "12345", null, "director", 0);
        PersonResponse crewMemberResponse = new PersonResponse("person", null, null, null, null, "producer", 0);
        PersonResponse crewMemberResponse2 = new PersonResponse("person", null, null, null, null, null, 0);

        PersonResponse[] cast = {personResponse};
        PersonResponse[] crew = {personDirectorResponse, crewMemberResponse, crewMemberResponse2};

        mockedResponse.setPosterPath("/test");
        mockedResponse.setBackdropPath("/test");

        // Create a mock response to return when getting cast for movie
        CastResponse mockedCastResponse = new CastResponse("12345", cast, crew);

        // Test when response is valid and has body
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedResponse, HttpStatus.OK), new ResponseEntity<>(mockedCastResponse, HttpStatus.OK));

        ResponseEntity<MovieResponse> response = movieController.getMovie("12345"); // call getMovieList which returns mocked response
        assertEquals(mockedResponse.getOverview(), response.getBody().getOverview());
        assertEquals(mockedResponse.getMovieId(), response.getBody().getMovieId());
        assertEquals(mockedResponse.getTitle(), response.getBody().getTitle());
        assertEquals(mockedResponse.getPosterPath(), response.getBody().getPosterPath());
        assertEquals(mockedResponse.getGenres(), response.getBody().getGenres());
        assertEquals(mockedResponse.getProductionCompanies(), response.getBody().getProductionCompanies());
        assertEquals(mockedResponse.getReleaseDate(), response.getBody().getReleaseDate());
        assertEquals(mockedCastResponse.getCast(), response.getBody().getCast());
        assertEquals(mockedCastResponse.getCrew()[0], response.getBody().getDirector());
        assertEquals(mockedResponse.getBackdropPath(), response.getBody().getBackdropPath());
    }

    @Test
    void movieControllerGetMovieDetailTestFail(){
        // Test when response is valid and has body
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenThrow(IllegalArgumentException.class);

        ResponseEntity<MovieResponse> response = movieController.getMovie("12345"); // call getMovieList which returns mocked response
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void movieControllerGetListMovies(){
        // Test when response is valid and has body
        String [] movieIds = {"12345"};
        MovieResponse mockMovieResponse = new MovieResponse("", "", "12345", "", null, null, "", null, null, "",1);
        List<MovieResponse> mockListResponse = new ArrayList<>();
        mockListResponse.add(mockMovieResponse);
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockMovieResponse, HttpStatus.OK));

        ResponseEntity<List<MovieResponse>> response = movieController.getListMovies(movieIds); // call getMovieList which returns mocked response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockListResponse, response.getBody());

        // Test when response is invalid
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenThrow(IllegalArgumentException.class);
        response = movieController.getListMovies(movieIds); // call getMovieList which returns mocked response
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void movieControllerGetRecommendations(){
        // Test when response is valid
        RecommendationsRequest mockRequest = new RecommendationsRequest();
        String[] mockMovieIds = {"1234", "5678"};
        mockRequest.setMovieIds(mockMovieIds);
        mockRequest.setCount(2);
        assertEquals(mockMovieIds, mockRequest.getMovieIds());
        assertEquals(2, mockRequest.getCount());

        MovieResponse mockMovieResponse1 = new MovieResponse(null, null, "34928", null, null, null, null, null, null, null, 1);
        MovieResponse mockMovieResponse2 = new MovieResponse(null, null, "82734", null, null, null, null, null, null, null, 1);

        ArrayList<MovieResponse> listMovieResponse = new ArrayList<>();
        listMovieResponse.add(mockMovieResponse1);
        listMovieResponse.add(mockMovieResponse2);
        MovieSearchResponse mockSearchResponse = new MovieSearchResponse(listMovieResponse, 2, 1, 1);

        ArrayList<MovieResponse> listMovieResponseEmpty = new ArrayList<>();
        MovieSearchResponse mockSearchResponseEmpty = new MovieSearchResponse(listMovieResponseEmpty, 0, 0, 0);

        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponseEmpty, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));

        ResponseEntity<List<MovieResponse>> response = movieController.getRecommendations(mockRequest);
        assertEquals(2, response.getBody().size());

        // Test when there are not enough movies to be recommended with given movieId array
        MovieResponse mockMovieResponse3 = new MovieResponse(null, null, "98723", null, null, null, null, null, null, null, 1);
        listMovieResponse.add(mockMovieResponse3);
        mockSearchResponse = new MovieSearchResponse(listMovieResponse, 3, 1, 0);
        mockRequest.setCount(4);
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK),
                new ResponseEntity<>(mockSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));
        response = movieController.getRecommendations(mockRequest);
        assertEquals(3, response.getBody().size());

        // Test when the only given movie in request doesn't have any recommendations
        String[] mockMovieIdsEmpty = {"1234"};
        mockRequest.setMovieIds(mockMovieIdsEmpty);
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponseEmpty, HttpStatus.OK));
        response = movieController.getRecommendations(mockRequest);
        assertEquals(0, response.getBody().size());

        // Test when response is invalid
        Mockito.when(restTemplate.getForEntity(anyString(),any(),
                any(Class.class))).thenThrow(IllegalArgumentException.class);
        response = movieController.getRecommendations(mockRequest);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}
