package edu.usc.csci310.project.demo.api.controllers;

import edu.usc.csci310.project.demo.api.requests.*;
import edu.usc.csci310.project.demo.api.responses.WatchlistResponse;
import edu.usc.csci310.project.demo.db.model.Movie;
import edu.usc.csci310.project.demo.db.model.User;
import edu.usc.csci310.project.demo.db.model.Watchlist;
import edu.usc.csci310.project.demo.db.repository.MovieRepository;
import edu.usc.csci310.project.demo.db.repository.UserRepository;
import edu.usc.csci310.project.demo.db.repository.WatchlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
@RequestMapping("/api")
public class WatchlistController {
    UserRepository userRepository;
    WatchlistRepository watchlistRepository;
    MovieRepository movieRepository;
    public WatchlistController(UserRepository userRepository, WatchlistRepository watchlistRepository, MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.watchlistRepository = watchlistRepository;
        this.movieRepository = movieRepository;
    }

    @PostMapping("/lists/new")
    public ResponseEntity<WatchlistResponse> createNewList(@RequestBody NewListRequest request) {
        UUID userId = request.getUuid();
        String listName = request.getListName();
        Optional<User> foundUser = userRepository.findByUuid(userId);
        if (!foundUser.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Optional<Watchlist> foundList = watchlistRepository.findByUserUuidAndName(userId, listName);
        if (foundList.isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Watchlist list = new Watchlist();
        list.setName(listName);
        list.setUser(foundUser.get());
        list.setPrivacy(request.getPrivacy());
        watchlistRepository.save(list);

        WatchlistResponse response = new WatchlistResponse();
        response.setListName(listName);
        response.setListId(list.getId());
        response.setPrivacy(list.getPrivacy());
        return ResponseEntity.ok().body(response);
    }

    @Transactional
    @PostMapping("/lists/delete")
    public ResponseEntity<List<WatchlistResponse>> deleteList(@RequestBody DeleteListRequest request) {
        UUID userId = request.getUuid();
        long listId = request.getListId();

        Optional<User> foundUser = userRepository.findByUuid(userId);
        if (!foundUser.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!watchlistRepository.existsById(listId)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Movie> listMovies = movieRepository.findByWatchlistId(listId);
        for(Movie m : listMovies) {
            movieRepository.deleteByWatchlistIdAndExternalId(listId, m.getExternalId());
        }

        watchlistRepository.deleteWatchlistById(listId);
        List<Watchlist> watchlists = watchlistRepository.findByUserUuid(userId);

        List<WatchlistResponse> responseList = new ArrayList<>();
        for(Watchlist l : watchlists){
            WatchlistResponse response = new WatchlistResponse();
            response.setListName(l.getName());
            response.setListId(l.getId());
            response.setPrivacy(l.getPrivacy());

            responseList.add(response);
        }
        return ResponseEntity.ok().body(responseList);
    }

    @GetMapping("/lists/{id}")
    public ResponseEntity<List<WatchlistResponse>> getUserWatchlists(@PathVariable("id") UUID uuid) {
        Optional<User> foundUser = userRepository.findByUuid(uuid);
        if (!foundUser.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<Watchlist> foundLists = watchlistRepository.findByUserUuid(uuid);
        List<WatchlistResponse> responses = new ArrayList<WatchlistResponse>();
        for (Watchlist l : foundLists) {
            WatchlistResponse response = new WatchlistResponse();
            response.setListName(l.getName());
            response.setListId(l.getId());
            response.setPrivacy(l.getPrivacy());
            List<Movie> foundMovies = movieRepository.findByWatchlistId(l.getId());
            if (!foundMovies.isEmpty()) {
                String[] externalIds = new String[foundMovies.size()];
                for (int i = 0; i < foundMovies.size(); i++ ) {
                    externalIds[i] = foundMovies.get(i).getExternalId();
                }
                response.setMovieIds(externalIds);
            }
            responses.add(response);
        }
        return ResponseEntity.ok().body(responses);
    }

    @PostMapping("/lists/add")
    public ResponseEntity<WatchlistResponse> addMovie(@RequestBody AddMovieRequest request) {
        long listId = request.getListId();
        String movieId = request.getMovieId();
        Optional<Watchlist> foundList = watchlistRepository.findById(listId);
        if (!foundList.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Movie movie = new Movie();
        movie.setExternalId(movieId);
        movie.setWatchlist(foundList.get());
        movieRepository.save(movie);

        WatchlistResponse response = new WatchlistResponse();
        response.setListId(listId);
        response.setListName(foundList.get().getName());
        response.setPrivacy(foundList.get().getPrivacy());
        List<Movie> foundMovies = movieRepository.findByWatchlistId(listId);
        if (!foundMovies.isEmpty()) {
            String[] externalIds = new String[foundMovies.size()];
            for (int i = 0; i < foundMovies.size(); i++) {
                externalIds[i] = foundMovies.get(i).getExternalId();
            }
            response.setMovieIds(externalIds);
        }
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/lists/new/withMovies")
    public ResponseEntity<WatchlistResponse> newListWithMovies(@RequestBody NewListWithMoviesRequest request) {
        NewListRequest newListRequest = request.getNewListRequest();
        List<String> movieIds = request.getMovieIds();

        ResponseEntity<WatchlistResponse> newListResponse = createNewList(newListRequest);
        if(newListResponse.getStatusCode() != HttpStatus.OK){
            return new ResponseEntity<>(newListResponse.getStatusCode());
        }

        ResponseEntity<WatchlistResponse> response = ResponseEntity.ok().body(newListResponse.getBody());
        for(int i = 0; i < movieIds.size(); i++){
            AddMovieRequest addMovieRequest = new AddMovieRequest();
            addMovieRequest.setMovieId(movieIds.get(i));
            addMovieRequest.setListId(newListResponse.getBody().getListId());
            response = addMovie(addMovieRequest);
        }

        return ResponseEntity.ok().body(response.getBody());
    }

    @Transactional
    @PostMapping("/lists/remove")
    public ResponseEntity<WatchlistResponse> removeMovie(@RequestBody AddMovieRequest request) {
        long listId = request.getListId();
        String movieId = request.getMovieId();
        Optional<Watchlist> foundList = watchlistRepository.findById(listId);
        Optional<Movie> foundMovie = movieRepository.findByWatchlistIdAndExternalId(listId, movieId);
        if (!foundMovie.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        movieRepository.deleteByWatchlistIdAndExternalId(listId, movieId);

        WatchlistResponse response = new WatchlistResponse();
        response.setListId(listId);
        response.setListName(foundList.get().getName());
        response.setPrivacy(foundList.get().getPrivacy());
        List<Movie> foundMovies = movieRepository.findByWatchlistId(listId);
        if (!foundMovies.isEmpty()) {
            String[] externalIds = new String[foundMovies.size()];
            for (int i = 0; i < foundMovies.size(); i++) {
                externalIds[i] = foundMovies.get(i).getExternalId();
            }
            response.setMovieIds(externalIds);
        }
        return ResponseEntity.ok().body(response);
    }

        @PostMapping("/lists/privacy")
        public ResponseEntity<WatchlistResponse> setPrivacy(@RequestBody PrivacyRequest request) {
            long listId = request.getListId();
            boolean privacy = request.getPrivacy();
            Optional<Watchlist> foundList = watchlistRepository.findById(listId);
            if (!foundList.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Watchlist list = foundList.get();
            list.setPrivacy(privacy);
            watchlistRepository.save(list);

            WatchlistResponse response = new WatchlistResponse();
            response.setListId(listId);
            response.setListName(list.getName());
            response.setPrivacy(list.getPrivacy());
            List<Movie> foundMovies = movieRepository.findByWatchlistId(listId);
            if (!foundMovies.isEmpty()) {
                String[] externalIds = new String[foundMovies.size()];
                for (int i = 0; i < foundMovies.size(); i++) {
                    externalIds[i] = foundMovies.get(i).getExternalId();
                }
                response.setMovieIds(externalIds);
            }
            return ResponseEntity.ok().body(response);
        }

        @PostMapping("/lists/rename")
        public ResponseEntity<WatchlistResponse> renameList(@RequestBody ListRenameRequest request) {
            long listId = request.getListId();
            String newName = request.getListName();
            UUID userId = request.getUserId();

            Optional<Watchlist> foundList = watchlistRepository.findById(listId);
            if (!foundList.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Optional<Watchlist> duplicateList = watchlistRepository.findByUserUuidAndName(userId, newName);
            if(duplicateList.isPresent() && duplicateList.get().getId() != listId){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Watchlist list = foundList.get();
            list.setName(newName);
            watchlistRepository.save(list);

            WatchlistResponse response = new WatchlistResponse();
            response.setListId(listId);
            response.setListName(list.getName());
            response.setPrivacy(list.getPrivacy());
            List<Movie> foundMovies = movieRepository.findByWatchlistId(listId);
            if (!foundMovies.isEmpty()) {
                String[] externalIds = new String[foundMovies.size()];
                for (int i = 0; i < foundMovies.size(); i++) {
                    externalIds[i] = foundMovies.get(i).getExternalId();
                }
                response.setMovieIds(externalIds);
            }
            return ResponseEntity.ok().body(response);
        }

        @GetMapping("/lists/public")
        public ResponseEntity<List<WatchlistResponse>> getPublicWatchlists() {
            List<Watchlist> foundLists = watchlistRepository.findByPrivacyFalse();
            List<WatchlistResponse> responses = new ArrayList<WatchlistResponse>();
            for (Watchlist l : foundLists) {
                WatchlistResponse response = new WatchlistResponse();
                response.setListName(l.getName());
                response.setListId(l.getId());
                response.setPrivacy(l.getPrivacy());
                List<Movie> foundMovies = movieRepository.findByWatchlistId(l.getId());
                if (!foundMovies.isEmpty()) {
                    String[] externalIds = new String[foundMovies.size()];
                    for (int i = 0; i < foundMovies.size(); i++ ) {
                        externalIds[i] = foundMovies.get(i).getExternalId();
                    }
                    response.setMovieIds(externalIds);
                }
                responses.add(response);
            }
            return ResponseEntity.ok().body(responses);
        }






}
