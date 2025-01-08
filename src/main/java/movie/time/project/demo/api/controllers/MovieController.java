package movie.time.project.demo.api.controllers;
import movie.time.project.demo.api.requests.RecommendationsRequest;
import movie.time.project.demo.api.responses.MovieResponse;
import movie.time.project.demo.api.responses.CastResponse;
import movie.time.project.demo.api.responses.MovieSearchResponse;
import movie.time.project.demo.api.responses.PersonResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/movie")
// Controller to get person data from TMDB
public class MovieController {

    public MovieController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Get apiKey value from application.properties. Used to access TMDB
    @Value("${api.key}")
    private String apiKey;

    // Rest template instantiated in Config.java
    private RestTemplate restTemplate;

    @GetMapping("/{movieID}") // map api url for fetch
    public ResponseEntity<MovieResponse> getMovie(@PathVariable("movieID") String movieID){
        try { // Try to get data from link
            // first param is link of database/api, second param is to convert json object to java object
            // make sure java object class has same variable names as json key in database, otherwise will not convert properly
            ResponseEntity<MovieResponse> responseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + apiKey, MovieResponse.class
            );

            ResponseEntity<CastResponse> castResponseEntity = restTemplate.getForEntity(
                    "https://api.themoviedb.org/3/movie/" + movieID + "/credits?api_key=" + apiKey + "&language=en-US", CastResponse.class
            );

            MovieResponse response = responseEntity.getBody(); // get responseEntity body (which is Person object)
            CastResponse cast = castResponseEntity.getBody();
            response.setCast(cast.getCast());

            PersonResponse[] crew = cast.getCrew();
            for(int i = 0; i < crew.length; i++){
                if(crew[i].getJob() != null && crew[i].getJob().equalsIgnoreCase("director")){
                    response.setDirector(crew[i]);
                }
            }

            return ResponseEntity.ok().body(response); // Return good response with results in body
        }
        catch(IllegalArgumentException e){ // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }

    @PostMapping("/list") // map api url for fetch
    public ResponseEntity<List<MovieResponse>> getListMovies(@RequestBody String[] request){
        try {
            List<MovieResponse> responseList = new ArrayList<>();

            for(int i = 0; i < request.length; i++){
                ResponseEntity<MovieResponse> responseEntity = restTemplate.getForEntity(
                        "https://api.themoviedb.org/3/movie/" + request[i] + "?api_key=" + apiKey, MovieResponse.class
                );

                responseList.add(responseEntity.getBody());
            }

            return ResponseEntity.ok().body(responseList); // Return good response with results in body
        }
        catch(IllegalArgumentException e){ // Unable to get data from link
            return ResponseEntity.badRequest().build(); // Return bad response
        }
    }

    @PostMapping("/list/recommendations")
    public ResponseEntity<List<MovieResponse>> getRecommendations(@RequestBody RecommendationsRequest request){
        try{
            // First generate random indexes for movieIds array to base recommendations on
            Integer[] arr = new Integer[request.getMovieIds().length];
            for (int i = 0; i < arr.length; i++) {
                arr[i] = i;
            }
            Collections.shuffle(Arrays.asList(arr));

            List<MovieResponse> responseList = new ArrayList<>();
            HashMap<Integer, ArrayList<Integer>> randomIndexes = new HashMap<>();
            HashSet<String> alreadyGenerated = new HashSet<>();
            int index = 0;
            int i = 0;
            List<Integer> noRecIndexes = new ArrayList<>();

            while(i < request.getCount()){
                if(index >= arr.length){ index = 0; }

                ResponseEntity<MovieSearchResponse> recommendations = restTemplate.getForEntity(
                        "https://api.themoviedb.org/3/movie/" + request.getMovieIds()[arr[index]] + "/recommendations?api_key=" + apiKey, MovieSearchResponse.class
                );

                if(randomIndexes.get(index) == null){
                    ArrayList<Integer> indexes = new ArrayList<>();
                    for (int j = 0; j < recommendations.getBody().getTotalResults(); j++) {
                        indexes.add(j);
                    }

                    Collections.shuffle(indexes);
                    randomIndexes.put(index, indexes);
                }

                ArrayList<Integer> indexArray = randomIndexes.get(index);

                // Check if the movie has no recommendations
                if(indexArray.size() == 0){
                    if(!noRecIndexes.contains(index)){
                        noRecIndexes.add(index);
                    }

                    if(noRecIndexes.size() < request.getMovieIds().length) { // If all
                        index++;
                        continue;
                    }
                    else{
                        break;
                    }
                }

                int j = 0;
                int recNum = indexArray.get(j);
                int pageNum = recNum / 20;
                int recIndex = recNum - (20 * pageNum);
                recommendations = restTemplate.getForEntity(
                        "https://api.themoviedb.org/3/movie/" + request.getMovieIds()[arr[index]] + "/recommendations?api_key=" + apiKey + "&page=" + (pageNum + 1), MovieSearchResponse.class
                );

                // Check if retrieved movie was already generated as recommendations
                while(alreadyGenerated.contains(recommendations.getBody().getResults().get(recIndex).getMovieId()) && j < (indexArray.size() - 1)){
                    j++;
                    recNum = indexArray.get(j);
                    pageNum = recNum / 20;
                    recIndex = recNum - (20 * pageNum);
                    recommendations = restTemplate.getForEntity(
                            "https://api.themoviedb.org/3/movie/" + request.getMovieIds()[arr[index]] + "/recommendations?api_key=" + apiKey + "&page=" + (pageNum + 1), MovieSearchResponse.class
                    );
                }

                if(alreadyGenerated.contains(recommendations.getBody().getResults().get(recIndex).getMovieId())){
                    noRecIndexes.add(index);
                }
                else {
                    MovieResponse recommendation = recommendations.getBody().getResults().get(recIndex);
                    alreadyGenerated.add(recommendation.getMovieId());
                    responseList.add(recommendation);
                }
                index++;
                i++;
            }

            return ResponseEntity.ok().body(responseList);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.notFound().build();
        }
    }
}
