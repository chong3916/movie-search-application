package movie.time.project.demo.controllers;

import movie.time.project.demo.api.controllers.SearchController;
import movie.time.project.demo.api.responses.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;

public class SearchControllerTest {
    private RestTemplate restTemplate = mock(RestTemplate.class);

    private SearchController searchController = new SearchController(restTemplate);

    @Test
    void searchControllerForMoveByTitleWorks() {
        MovieResponse movieResponseTest1 = new MovieResponse("overview", "title", "12345", "/test", null, null, "2023-01-01", null, null, "/test", 1);
        MovieResponse movieResponse = new MovieResponse(null, null, null, null, null, null, null, null, null, null, 1);
        movieResponse.setOverview("overview");
        movieResponse.setTitle("title");
        movieResponse.setMovieId("23456");
        movieResponse.setReleaseDate("2023-01-01");
        movieResponse.setPosterPath(null);
        movieResponse.setBackdropPath(null);
        movieResponse.setPosterPath("/test");
        movieResponse.setBackdropPath("/test");
        assertEquals("12345", movieResponseTest1.getMovieId());

        GenreResponse genreResponse = new GenreResponse(null, null);
        genreResponse.setId("1");
        genreResponse.setName("testGenre");
        assertEquals("1", genreResponse.getId());
        assertEquals("testGenre", genreResponse.getName());
        GenreResponse[] genres = {genreResponse};
        movieResponse.setGenres(genres);

        ProductionCompaniesResponse productionCompaniesResponse = new ProductionCompaniesResponse(null, null);
        productionCompaniesResponse.setId("1");
        productionCompaniesResponse.setName("testProduction");
        assertEquals("1", productionCompaniesResponse.getId());
        assertEquals("testProduction", productionCompaniesResponse.getName());
        ProductionCompaniesResponse[] productionCompanies = {productionCompaniesResponse};
        movieResponse.setProductionCompanies(productionCompanies);

        PersonResponse personResponseTest = new PersonResponse(null, "/test", null, "12345", null, null, 0);
        PersonResponse personResponse = new PersonResponse(null, null, null, null, null, null, 0);
        personResponse.setName("person");
        personResponse.setProfilePath(null);
        personResponse.setProfilePath("/test");
        personResponse.setPersonId("12345");
        personResponse.setKnownForDepartment("acting");
        personResponse.setOrder(1);
        personResponse.setCharacter("character");
        assertEquals("12345", personResponseTest.getPersonId());
        assertEquals("person", personResponse.getName());
        assertEquals("https://image.tmdb.org/t/p/w500/test", personResponse.getProfilePath());
        assertEquals("acting", personResponse.getKnownForDepartment());
        assertEquals(1, personResponse.getOrder());
        assertEquals("character", personResponse.getCharacter());
        PersonResponse[] cast = {personResponse};
        movieResponse.setCast(cast);
        PersonResponse directorPersonResponse = new PersonResponse("director", null, "directing", null, null, null, 0);
        directorPersonResponse.setJob("director");
        assertEquals("director", directorPersonResponse.getJob());
        movieResponse.setDirector(directorPersonResponse);

        CastResponse castResponse = new CastResponse(null, null, null);
        PersonResponse[] crew = {directorPersonResponse};
        castResponse.setCast(cast);
        castResponse.setCrew(crew);
        castResponse.setId("12345");
        assertEquals(cast, castResponse.getCast());
        assertEquals(crew, castResponse.getCrew());
        assertEquals("12345", castResponse.getId());
        assertEquals("overview", movieResponse.getOverview());
        assertEquals("title", movieResponse.getTitle());
        assertEquals("https://image.tmdb.org/t/p/original/test", movieResponse.getPosterPath());
        assertEquals("https://image.tmdb.org/t/p/w1280/test", movieResponse.getBackdropPath());
        assertEquals("2023-01-01", movieResponse.getReleaseDate());
        assertEquals(1, movieResponse.getCast().length);
        assertEquals(personResponse, movieResponse.getCast()[0]);
        assertEquals(1, movieResponse.getProductionCompanies().length);
        assertEquals(productionCompaniesResponse, movieResponse.getProductionCompanies()[0]);
        assertEquals(1, movieResponse.getGenres().length);
        assertEquals(genreResponse, movieResponse.getGenres()[0]);
        assertEquals(directorPersonResponse, movieResponse.getDirector());


        ArrayList<MovieResponse> movieList = new ArrayList<>();
        movieList.add(movieResponse);
        MovieSearchResponse mockedResponse = new MovieSearchResponse(null, 0, 0, 0);
        mockedResponse.setResults(movieList);
        mockedResponse.setTotalResults(5);
        mockedResponse.setTotalPages(5);
        mockedResponse.setLastPage(5);
        assertEquals(5, mockedResponse.getTotalResults());
        assertEquals(5, mockedResponse.getTotalPages());
        assertEquals(5, mockedResponse.getLastPage());
        assertEquals(movieList, mockedResponse.getResults());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedResponse, HttpStatus.OK));

        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchTitle("test", "null", "null", 0); // call getMovieList which returns mocked response
        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(movieList.get(0).getMovieId(), response.getBody().getResults().get(0).getMovieId());
    }

    @Test
    void searchControllerForMovieByTitleFails() {
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(HttpStatus.OK));

        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchTitle("test", "null", "null", 0); // call getMovieList which returns new mocked response with no body
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(new MovieSearchResponse(null, 0, 0, 0), HttpStatus.OK));

        response = searchController.getMovieSearchTitle("test", "null", "null", 0); // call getMovieList which returns new mocked response with null movie list
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(new MovieSearchResponse(new ArrayList<>(), 0, 0, 0), HttpStatus.OK));

        response = searchController.getMovieSearchTitle("test", "null", "null", 0); // call getMovieList which returns new mocked response with empty movie list
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.BAD_REQUEST));
        response = searchController.getMovieSearchTitle("test", "null", "null", 0); // call getMovieList which returns new mocked response with bad status
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenThrow(new IllegalArgumentException());
        response = searchController.getMovieSearchTitle("test", "null", "null", 0); // call getMovieList which returns new mocked response with bad status
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

    }

    @Test
    void searchControllerForMovieByActorWorks() {
        PersonResponse personResponse = new PersonResponse("person", "/test", "acting", "12345", "character", null, 2);
        PersonResponse[] cast = {personResponse};

        PersonSearchResponse mockedPersonSearchResponse = new PersonSearchResponse(null, 0, 0);
        mockedPersonSearchResponse.setResults(cast);
        mockedPersonSearchResponse.setTotalResults(1);
        mockedPersonSearchResponse.setTotalPages(1);
        assertEquals(cast, mockedPersonSearchResponse.getResults());
        assertEquals(1, mockedPersonSearchResponse.getTotalPages());
        assertEquals(1, mockedPersonSearchResponse.getTotalResults());

        MovieResponse movieResponse = new MovieResponse("overview", "title", "12345", "/test", null, null, "2020-01-01", cast, null, null, 1);

        ArrayList<MovieResponse> movieList = new ArrayList<>();
        movieList.add(movieResponse);
        MovieSearchResponse mockedResponse = new MovieSearchResponse(movieList, 5, 5, 5);

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedPersonSearchResponse, HttpStatus.OK), new ResponseEntity<>(mockedResponse, HttpStatus.OK));

        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchActor("test", "null", "null", 0); // call getMovieList which returns mocked response
        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(movieList.get(0).getMovieId(), response.getBody().getResults().get(0).getMovieId());
    }

    @Test
    void searchControllerForMovieByActorFails() {
        PersonResponse personResponse = new PersonResponse("person", "/test", "acting", "12345", "character", null, 2);
        PersonResponse[] cast = {personResponse};

        PersonSearchResponse mockedPersonSearchResponse = new PersonSearchResponse(cast, 1, 1);

        // Test when response for person search has no actor
        PersonResponse noActorResponse = new PersonResponse("person", "/test", "directing", "12345", "character", null, 2);
        PersonResponse[] noActorList = {noActorResponse};
        PersonSearchResponse mockedPersonSearchNoActor = new PersonSearchResponse(noActorList, 1, 1);
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedPersonSearchNoActor, HttpStatus.OK));
        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchActor("person", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when response for person search has bad status
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(new PersonSearchResponse(null, 0, 0), HttpStatus.NOT_FOUND));
        response = searchController.getMovieSearchActor("person", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when response for person search has no body
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.OK));
        response = searchController.getMovieSearchActor("person", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when response for person search has empty list
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(new PersonSearchResponse(new PersonResponse[]{}, 0, 0), HttpStatus.OK));
        response = searchController.getMovieSearchActor("person", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when actor response is valid but the movie list in MovieSearchResponse body is null
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedPersonSearchResponse, HttpStatus.OK), new ResponseEntity<>(null, HttpStatus.OK));

        response = searchController.getMovieSearchActor("test", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when actor response is valid but the movie list in MovieSearchResponse results is null
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedPersonSearchResponse, HttpStatus.OK), new ResponseEntity<>(new MovieSearchResponse(null, 0, 0, 0), HttpStatus.OK));

        response = searchController.getMovieSearchActor("test", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when response is valid but the movie list in response body has length = 0
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedPersonSearchResponse, HttpStatus.OK), new ResponseEntity<>(new MovieSearchResponse(new ArrayList<>(), 0, 0, 0), HttpStatus.OK));

        response = searchController.getMovieSearchActor("test", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when response from api is bad status
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockedPersonSearchResponse, HttpStatus.OK), new ResponseEntity<>(null, HttpStatus.BAD_REQUEST));

        response = searchController.getMovieSearchActor("test", "null", "null", 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // Test when unable to get data from api
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenThrow(new IllegalArgumentException());
        response = searchController.getMovieSearchActor("test", "null", "null", 0);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void searchControllerForKeywordFails() {
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
        ResponseEntity<KeywordSearchResponse> keywordSearchResponse = searchController.getSearchKeywords("test");
        assertEquals(HttpStatus.NOT_FOUND, keywordSearchResponse.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.OK));
        keywordSearchResponse = searchController.getSearchKeywords("test");
        assertEquals(HttpStatus.NOT_FOUND, keywordSearchResponse.getStatusCode());

        KeywordSearchResponse mockKeywordSearchResponseNull = new KeywordSearchResponse(null, 0);
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockKeywordSearchResponseNull, HttpStatus.OK));
        keywordSearchResponse = searchController.getSearchKeywords("test");
        assertEquals(HttpStatus.NOT_FOUND, keywordSearchResponse.getStatusCode());

        mockKeywordSearchResponseNull = new KeywordSearchResponse(new ArrayList<>(), 0);
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockKeywordSearchResponseNull, HttpStatus.OK));
        keywordSearchResponse = searchController.getSearchKeywords("test");
        assertEquals(HttpStatus.NOT_FOUND, keywordSearchResponse.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenThrow(new IllegalArgumentException());
        keywordSearchResponse = searchController.getSearchKeywords("test");
        assertEquals(HttpStatus.BAD_REQUEST, keywordSearchResponse.getStatusCode());
    }

    @Test
    void searchControllerForKeywordWorks() {
        KeywordResponse mockKeywordResponse = new KeywordResponse(null, null);
        mockKeywordResponse.setId("1234");
        mockKeywordResponse.setName("test");
        assertEquals("1234", mockKeywordResponse.getId());
        assertEquals("test", mockKeywordResponse.getName());

        ArrayList<KeywordResponse> mockKeywordResponseList = new ArrayList<>();
        mockKeywordResponseList.add(mockKeywordResponse);

        KeywordSearchResponse mockKeywordSearchResponse = new KeywordSearchResponse(null, 0);
        mockKeywordSearchResponse.setResults(mockKeywordResponseList);
        mockKeywordSearchResponse.setTotalResults(1);
        assertEquals(mockKeywordResponseList, mockKeywordSearchResponse.getResults());
        assertEquals(1, mockKeywordSearchResponse.getTotalResults());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockKeywordSearchResponse, HttpStatus.OK));

        ResponseEntity<KeywordSearchResponse> keywordSearchResponse = searchController.getSearchKeywords("test");
        assertEquals(mockKeywordSearchResponse, keywordSearchResponse.getBody());

    }

    @Test
    void searchControllerForMovieKeywordFails() {
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchKeyword("1234", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.OK));
        response = searchController.getMovieSearchKeyword("1234", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        MovieSearchResponse mockSearchResponse = new MovieSearchResponse(null, 0, 0, 0);
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));
        response = searchController.getMovieSearchKeyword("1234", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        mockSearchResponse = new MovieSearchResponse(new ArrayList<>(), 0, 0, 0);
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));
        response = searchController.getMovieSearchKeyword("1234", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenThrow(new IllegalArgumentException());
        response = searchController.getMovieSearchKeyword("1234", null, null, 0);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void searchControllerForMovieKeywordWorks() {
        ArrayList<MovieResponse> mockMovieResponseList = new ArrayList<>();
        MovieResponse mockMovieResponse = new MovieResponse(null, null, "12345", null, null, null, null, null, null, null, 1);
        mockMovieResponseList.add(mockMovieResponse);
        MovieSearchResponse mockSearchResponse = new MovieSearchResponse(mockMovieResponseList, 5, 5, 5);

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));

        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchKeyword("1234", "", "", 0);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockSearchResponse.getResults().get(0), response.getBody().getResults().get(0));
    }

    @Test
    void searchControllerForMovieGenreWorks() {
        ArrayList<MovieResponse> mockMovieResponseList = new ArrayList<>();
        GenreResponse mockGenreResponse = new GenreResponse("12", "action");
        MovieResponse mockMovieResponse = new MovieResponse(null, null, null, null, new GenreResponse[]{mockGenreResponse}, null, null, null, null, null, 1);
        mockMovieResponseList.add(mockMovieResponse);
        MovieSearchResponse mockSearchResponse = new MovieSearchResponse(mockMovieResponseList, 5, 5, 5);

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));
        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchGenre("12", "", "", 0);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockGenreResponse, response.getBody().getResults().get(0).getGenres()[0]);
    }

    @Test
    void searchControllerForMovieGenreFails() {
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
        ResponseEntity<MovieSearchResponse> response = searchController.getMovieSearchGenre("12", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(null, HttpStatus.OK));
        response = searchController.getMovieSearchGenre("12", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        MovieSearchResponse mockSearchResponse = new MovieSearchResponse(null, 0, 0, 0);
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));
        response = searchController.getMovieSearchGenre("12", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        mockSearchResponse = new MovieSearchResponse(new ArrayList<>(), 0, 0, 0);
        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenReturn(new ResponseEntity<>(mockSearchResponse, HttpStatus.OK));
        response = searchController.getMovieSearchGenre("12", null, null, 0);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        Mockito.when(restTemplate.getForEntity(anyString(), any(),
                any(Class.class))).thenThrow(new IllegalArgumentException());
        response = searchController.getMovieSearchGenre("12", null, null, 0);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void filterMovieByYear() {
        ArrayList<MovieResponse> list = new ArrayList<>();
        MovieResponse movie1 = new MovieResponse(null, null, null, null, null, null, "2020-01-01", null, null, null, 1);
        MovieResponse movie2 = new MovieResponse(null, null, null, null, null, null, "2023-01-01", null, null, null, 1);
        MovieResponse movie3 = new MovieResponse(null, null, null, null, null, null, "2019-01-01", null, null, null, 1);

        list.add(movie1);
        list.add(movie2);
        list.add(movie3);

        // Test when start and end year strings are empty;
        ArrayList<MovieResponse> responseList = searchController.filterMovies(list, "", "");
        assertEquals(list, responseList);

        // Test when filter by only start year
        responseList = searchController.filterMovies(list, "2020", "");
        assertEquals(2, responseList.size());
        list.add(movie3);

        // Test when filter by only end year
        responseList = searchController.filterMovies(list, "", "2020");
        assertEquals(2, responseList.size());
        list.add(movie2);

        // Test when filter by both start and end year
        responseList = searchController.filterMovies(list, "2020", "2022");
        assertEquals(1, responseList.size());

        ArrayList<MovieResponse> list2 = new ArrayList<>();
        MovieResponse nullMovie = new MovieResponse(null, null, null, null, null, null, null, null, null, null, 1);
        MovieResponse emptyMovie = new MovieResponse(null, null, null, null, null, null, "", null, null, null, 1);
        list2.add(nullMovie);
        list2.add(emptyMovie);

        responseList = searchController.filterMovies(list2, "2020", "");
        assertEquals(2, responseList.size());
        responseList = searchController.filterMovies(list2, "", "2020");
        assertEquals(2, responseList.size());
        responseList = searchController.filterMovies(list2, "2020", "2022");
        assertEquals(2, responseList.size());
    }
}
