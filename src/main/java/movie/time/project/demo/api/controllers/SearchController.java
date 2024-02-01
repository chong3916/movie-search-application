package movie.time.project.demo.api.controllers;
import movie.time.project.demo.api.responses.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/search")
// Controller to get search results from TMDB
public class SearchController {

    public SearchController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Value("${api.key}")
    private String apiKey;

    private RestTemplate restTemplate;

    @GetMapping("/title/{searchTerm}/{searchStartYear}/{searchEndYear}/{page}")
    public ResponseEntity<MovieSearchResponse> getMovieSearchTitle(@PathVariable("searchTerm") String searchTerm, @PathVariable("searchStartYear") String startYear, @PathVariable("searchEndYear") String endYear, @PathVariable("page") int page){
        try {
            ResponseEntity<MovieSearchResponse> responseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + searchTerm, MovieSearchResponse.class
            );
            if(responseEntity.getStatusCode() != HttpStatus.OK || !responseEntity.hasBody() || responseEntity.getBody().getResults() == null || responseEntity.getBody().getResults().size() == 0){
                return ResponseEntity.notFound().build(); // Return bad response
            }

            ArrayList<MovieResponse> responseList = new ArrayList<>();

            int totalPages = responseEntity.getBody().getTotalPages();
            int numPages = Math.min(totalPages, (page + 5));

            for(int i = page + 1; i <= numPages; i++){ // get all results
                responseEntity = restTemplate.getForEntity(
                        "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + searchTerm + "&page=" + i, MovieSearchResponse.class
                );

                responseList.addAll(responseEntity.getBody().getResults());
            }

            MovieSearchResponse response = new MovieSearchResponse(null, 0, totalPages, numPages); // get responseEntity body (which is MovieResponse object) and call MovieResponse.getResults()
            ArrayList<MovieResponse> filteredMovies = filterMovies(responseList, startYear, endYear);
            response.setResults(filteredMovies);
            response.setTotalResults(filteredMovies.size());
            return ResponseEntity.ok().body(response);
        }
        catch(IllegalArgumentException e){ // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }

    @GetMapping("/actor/{searchTerm}/{searchStartYear}/{searchEndYear}/{page}") // map api url for fetch
    public ResponseEntity<MovieSearchResponse> getMovieSearchActor(@PathVariable("searchTerm") String searchTerm, @PathVariable("searchStartYear") String startYear, @PathVariable("searchEndYear") String endYear, @PathVariable("page") int page){
        try { // Try to get data from link
            // First get actor's personId
            ResponseEntity<PersonSearchResponse> personResponseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/search/person?api_key=" + apiKey + "&search_type=ngram&query=" + searchTerm, PersonSearchResponse.class
            );
            if(!personResponseEntity.hasBody() || personResponseEntity.getStatusCode() != HttpStatus.OK){
                return ResponseEntity.notFound().build(); // Return bad response
            }

            // Get first person found that is an actor
            PersonResponse[] searchResults = personResponseEntity.getBody().getResults();
            PersonResponse actor = null;
            for(int i = 0; i < searchResults.length; i++){
                if(searchResults[i].getKnownForDepartment().equalsIgnoreCase("Acting")){
                    actor = searchResults[i];
                    break;
                }
            }

            // If there is no actor in search results, return bad response
            if(actor == null){
                return ResponseEntity.notFound().build(); // Return bad response
            }

            // Get movies actor is featured in
            ResponseEntity<MovieSearchResponse> responseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&with_people=" + actor.getPersonId(), MovieSearchResponse.class
            );

            if(responseEntity.getStatusCode() != HttpStatus.OK || !responseEntity.hasBody() || responseEntity.getBody().getResults() == null || responseEntity.getBody().getResults().size() == 0){
                return ResponseEntity.notFound().build(); // Return bad response
            }

            ArrayList<MovieResponse> responseList = new ArrayList<>();

            int totalPages = responseEntity.getBody().getTotalPages();
            int numPages = Math.min(totalPages, (page + 5));

            for(int i = page + 1; i <= numPages; i++){ // get all results
                responseEntity = restTemplate.getForEntity(
                        "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&with_people=" + actor.getPersonId() + "&page=" + i, MovieSearchResponse.class
                );

                responseList.addAll(responseEntity.getBody().getResults());
            }

            MovieSearchResponse response = new MovieSearchResponse(null, 0, totalPages, numPages); // get responseEntity body (which is MovieResponse object) and call MovieResponse.getResults()
            ArrayList<MovieResponse> filteredMovies = filterMovies(responseList, startYear, endYear);
            response.setResults(filteredMovies);
            response.setTotalResults(filteredMovies.size());
            return ResponseEntity.ok().body(response);
        }
        catch(IllegalArgumentException e){ // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }

    public ArrayList<MovieResponse> filterMovies(ArrayList<MovieResponse> responseList, String startYear, String endYear){
        boolean invalidStartYear = startYear.equals("null") || startYear.trim().isEmpty();
        boolean invalidEndYear = endYear.equals("null") || endYear.trim().isEmpty();
        if(invalidStartYear && invalidEndYear){ // no filter by year
            return responseList; // Return good response with results in body
        }
        else if(invalidEndYear){ // Only filter by start year
            for(int i = responseList.size() - 1; i >= 0; i--) {
                if (responseList.get(i).getReleaseDate() != null && responseList.get(i).getReleaseDate().trim().length() >= 4) {
                    if (Integer.parseInt(responseList.get(i).getReleaseDate().substring(0, 4)) < Integer.parseInt(startYear)) {
                        responseList.remove(i);
                    }
                }
            }

            return responseList; // Return good response with results in body
        }
        else if(invalidStartYear){ // only filter by end year
            for(int i = responseList.size() - 1; i >= 0; i--){
                if (responseList.get(i).getReleaseDate() != null && responseList.get(i).getReleaseDate().trim().length() >= 4) {
                    if (Integer.parseInt(responseList.get(i).getReleaseDate().substring(0, 4)) > Integer.parseInt(endYear)) {
                        responseList.remove(i);
                    }
                }
            }

            return responseList; // Return good response with results in body
        }
        else {
            for (int i = responseList.size() - 1; i >= 0; i--) {
                if (responseList.get(i).getReleaseDate() != null && responseList.get(i).getReleaseDate().trim().length() >= 4) {
                    if (Integer.parseInt(responseList.get(i).getReleaseDate().substring(0, 4)) < Integer.parseInt(startYear)) {
                        responseList.remove(i);
                    } else if (Integer.parseInt(responseList.get(i).getReleaseDate().substring(0, 4)) > Integer.parseInt(endYear)) {
                        responseList.remove(i);
                    }
                }
            }

            return responseList; // Return MovieSearchResponse
        }
    }

    @GetMapping("/keyword/{keywordId}/{searchStartYear}/{searchEndYear}/{page}") // map api url for fetch
    public ResponseEntity<MovieSearchResponse> getMovieSearchKeyword(@PathVariable("keywordId") String keywordId, @PathVariable("searchStartYear") String startYear, @PathVariable("searchEndYear") String endYear, @PathVariable("page") int page){
        try { // Try to get data from link
            // first param is link of database/api, second param is to convert json object to java object
            // make sure java object class has same variable names as json key in database, otherwise will not convert properly
            ResponseEntity<MovieSearchResponse> responseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&with_keywords=" + keywordId, MovieSearchResponse.class
            );

            if(responseEntity.getStatusCode() != HttpStatus.OK || !responseEntity.hasBody() || responseEntity.getBody().getResults() == null || responseEntity.getBody().getResults().size() == 0){
                return ResponseEntity.notFound().build(); // Return bad response
            }

            ArrayList<MovieResponse> responseList = new ArrayList<>();

            int totalPages = responseEntity.getBody().getTotalPages();
            int numPages = Math.min(totalPages, (page + 5));

            for(int i = page + 1; i <= numPages; i++){ // get all results
                responseEntity = restTemplate.getForEntity(
                        "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&with_keywords=" + keywordId + "&page=" + i, MovieSearchResponse.class
                );

                responseList.addAll(responseEntity.getBody().getResults());
            }


            MovieSearchResponse response = new MovieSearchResponse(null, 0, totalPages, numPages); // get responseEntity body (which is MovieResponse object) and call MovieResponse.getResults()
            ArrayList<MovieResponse> filteredMovies = filterMovies(responseList, startYear, endYear);
            response.setResults(filteredMovies);
            response.setTotalResults(filteredMovies.size());
            return ResponseEntity.ok().body(response);
        }
        catch(IllegalArgumentException e){ // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }

    @GetMapping("/keyword/{searchTerm}") // map api url for fetch
    public ResponseEntity<KeywordSearchResponse> getSearchKeywords(@PathVariable("searchTerm") String searchTerm){
        try {
            ResponseEntity<KeywordSearchResponse> responseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/search/keyword?api_key=" + apiKey + "&query=" + searchTerm, KeywordSearchResponse.class
            );
            if(responseEntity.getStatusCode() != HttpStatus.OK){
                return ResponseEntity.notFound().build(); // Return response not found
            }

            if(responseEntity.hasBody()) {
                if(responseEntity.getBody().getResults() != null && responseEntity.getBody().getResults().size() > 0) {
                    KeywordSearchResponse response = responseEntity.getBody(); // get responseEntity body (which is MovieResponse object) and call MovieResponse.getResults()
                    return ResponseEntity.ok().body(response);
                }
            }
            return ResponseEntity.notFound().build();
        }
        catch(IllegalArgumentException e){ // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }

    @GetMapping("/genre/{genreId}/{searchStartYear}/{searchEndYear}/{page}") // map api url for fetch
    public ResponseEntity<MovieSearchResponse> getMovieSearchGenre(@PathVariable("genreId") String genreId, @PathVariable("searchStartYear") String startYear, @PathVariable("searchEndYear") String endYear, @PathVariable("page") int page){
        try { // Try to get data from link
            // first param is link of database/api, second param is to convert json object to java object
            // make sure java object class has same variable names as json key in database, otherwise will not convert properly
            ResponseEntity<MovieSearchResponse> responseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&with_genres=" + genreId, MovieSearchResponse.class
            );

            if(responseEntity.getStatusCode() != HttpStatus.OK || !responseEntity.hasBody() || responseEntity.getBody().getResults() == null || responseEntity.getBody().getResults().size() == 0){
                return ResponseEntity.notFound().build(); // Return bad response
            }

            ArrayList<MovieResponse> responseList = new ArrayList<>();

            int totalPages = responseEntity.getBody().getTotalPages();
            int numPages = Math.min(totalPages, (page + 5));

            for(int i = page + 1; i <= numPages; i++){ // get all results
                responseEntity = restTemplate.getForEntity(
                        "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey + "&with_genres=" + genreId + "&page=" + i, MovieSearchResponse.class
                );

                responseList.addAll(responseEntity.getBody().getResults());
            }


            MovieSearchResponse response = new MovieSearchResponse(null, 0, totalPages, numPages); // get responseEntity body (which is MovieResponse object) and call MovieResponse.getResults()
            ArrayList<MovieResponse> filteredMovies = filterMovies(responseList, startYear, endYear);
            response.setResults(filteredMovies);
            response.setTotalResults(filteredMovies.size());
            return ResponseEntity.ok().body(response);
        }
        catch(IllegalArgumentException e){ // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }
}