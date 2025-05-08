package movie.time.project.demo.controllers;

import movie.time.project.demo.api.requests.*;
import movie.time.project.demo.api.responses.WatchlistResponse;
import movie.time.project.demo.db.model.Movie;
import movie.time.project.demo.db.model.User;
import movie.time.project.demo.db.model.Watchlist;
import movie.time.project.demo.db.repository.MovieRepository;
import movie.time.project.demo.db.repository.UserRepository;
import movie.time.project.demo.db.repository.WatchlistRepository;
import movie.time.project.demo.api.controllers.WatchlistController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class WatchlistControllerTest {
    WatchlistController watchlistController;

    UserRepository mockUserRepo;

    WatchlistRepository mockListRepo;

    MovieRepository mockMovieRepo;


    @BeforeEach
    public void beforeEach(){
        mockUserRepo = mock(UserRepository.class);
        mockListRepo = mock(WatchlistRepository.class);
        mockMovieRepo = mock(MovieRepository.class);
    }

    @Test
    public void createNewListTestFail() {
        NewListRequest request = new NewListRequest();
        UUID uuid = UUID.randomUUID();

        UserRepository mockUserRepo_fail = mock(UserRepository.class);
        WatchlistRepository mockListRepo_fail = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo_fail = mock(MovieRepository.class);

        when(mockUserRepo_fail.findByUuid(uuid)).thenReturn(Optional.empty());

        request.setUuid(uuid);
        request.setListName("test-name");
        request.setPrivacy(false);

        watchlistController = new WatchlistController(mockUserRepo_fail, mockListRepo_fail, mockMovieRepo_fail);
        ResponseEntity<WatchlistResponse> response = watchlistController.createNewList(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void createNewListTestExists() {
        NewListRequest request = new NewListRequest();
        User testUser = new User();
        request.setUuid(testUser.getUuid());
        request.setListName("test-name");
        request.setPrivacy(false);

        Watchlist testList = new Watchlist();
        testList.setUser(testUser);
        testList.setName("test-name");

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.of(testUser));
        when(mockListRepo.findByUserUuidAndName(testUser.getUuid(), "test-name")).thenReturn(Optional.of(testList));

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.createNewList(request);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void createNewListTestSuccess() {
        NewListRequest request = new NewListRequest();
        User testUser = new User();

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.of(testUser));

        request.setUuid(testUser.getUuid());
        request.setListName("test-name");
        request.setPrivacy(false);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.createNewList(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-name", response.getBody().getListName());
    }

    @Test
    public void getUserWatchlistsTestNoUser() {
        UUID uuid = UUID.randomUUID();

        UserRepository mockUserRepo_nouser = mock(UserRepository.class);
        WatchlistRepository mockListRepo_nouser = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo_nouser = mock(MovieRepository.class);

        when(mockUserRepo_nouser.findByUuid(uuid)).thenReturn(Optional.empty());

        watchlistController = new WatchlistController(mockUserRepo_nouser, mockListRepo_nouser, mockMovieRepo_nouser);
        ResponseEntity<List<WatchlistResponse>> response = watchlistController.getUserWatchlists(uuid);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void getUserWatchlistsEmptyList() {
        User testUser = new User();
        Watchlist emptyList = new Watchlist();
        emptyList.setName("test-list");
        List<Watchlist> testLists = new ArrayList<Watchlist>();
        testLists.add(emptyList);

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.of(testUser));
        when(mockListRepo.findByUserUuid(testUser.getUuid())).thenReturn(testLists);
        when(mockMovieRepo.findByWatchlistId(emptyList.getId())).thenReturn(new ArrayList<Movie>());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<List<WatchlistResponse>> response = watchlistController.getUserWatchlists(testUser.getUuid());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-list", response.getBody().get(0).getListName());
        assertEquals(null, response.getBody().get(0).getMovieIds());
    }

    @Test
    public void getUserWatchlistsNonEmptyList() {
        User testUser = new User();

        Watchlist list = new Watchlist();
        list.setName("test-list");
        List<Watchlist> testLists = new ArrayList<Watchlist>();
        testLists.add(list);

        Movie movie = new Movie();
        movie.setWatchlist(list);
        movie.setExternalId("test-id");
        List<Movie> testMovies = new ArrayList<Movie>();
        testMovies.add(movie);

        UserRepository mockUserRepo = mock(UserRepository.class);
        WatchlistRepository mockListRepo = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo = mock(MovieRepository.class);

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.of(testUser));
        when(mockListRepo.findByUserUuid(testUser.getUuid())).thenReturn(testLists);
        when(mockMovieRepo.findByWatchlistId(list.getId())).thenReturn(testMovies);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<List<WatchlistResponse>> response = watchlistController.getUserWatchlists(testUser.getUuid());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-list", response.getBody().get(0).getListName());
        assertEquals("test-id", response.getBody().get(0).getMovieIds()[0]);
    }

    @Test
    public void addMovieTestFail() {
        AddMovieRequest request = new AddMovieRequest();
        request.setMovieId("test-id");
        request.setListId(0);

        when(mockListRepo.findById(0L)).thenReturn(Optional.empty());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.addMovie(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void addMovieTestEmpty() {
        AddMovieRequest request = new AddMovieRequest();
        request.setMovieId("test-id");
        request.setListId(0);

        Watchlist testList = new Watchlist();
        testList.setName("test-name");

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(new ArrayList<Movie>());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.addMovie(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals(null, response.getBody().getMovieIds());
    }

    @Test
    public void addMovieTestNonEmpty() {
        AddMovieRequest request = new AddMovieRequest();
        request.setMovieId("test-id");
        request.setListId(0);

        Watchlist testList = new Watchlist();
        testList.setName("test-name");

        Movie movie = new Movie();
        movie.setWatchlist(testList);
        movie.setExternalId("test-id");
        List<Movie> movieList= new ArrayList<Movie>();
        movieList.add(movie);

        UserRepository mockUserRepo = mock(UserRepository.class);
        WatchlistRepository mockListRepo = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo = mock(MovieRepository.class);

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(movieList);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.addMovie(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals("test-id", response.getBody().getMovieIds()[0]);
    }

    @Test
    public void removeMovieTestFail() {
        AddMovieRequest request = new AddMovieRequest();
        request.setMovieId("test-id");
        request.setListId(0);

        when(mockListRepo.findById(0L)).thenReturn(Optional.empty());
        when(mockMovieRepo.findByWatchlistIdAndExternalId(0L, "test-id")).thenReturn(Optional.empty());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.removeMovie(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void removeMovieTestEmpty() {
        AddMovieRequest request = new AddMovieRequest();
        request.setMovieId("test-id");
        request.setListId(0);

        Watchlist testList = new Watchlist();
        testList.setName("test-name");

        Movie movie = new Movie();

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistIdAndExternalId(0L, "test-id")).thenReturn(Optional.of(movie));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(new ArrayList<Movie>());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.removeMovie(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals(null, response.getBody().getMovieIds());
    }

    @Test
    public void removeMovieTestNonEmpty() {
        AddMovieRequest request = new AddMovieRequest();
        request.setMovieId("test-id");
        request.setListId(0);

        Watchlist testList = new Watchlist();
        testList.setName("test-name");

        Movie movie = new Movie();
        movie.setWatchlist(testList);
        movie.setExternalId("test-id");
        List<Movie> movieList= new ArrayList<Movie>();
        movieList.add(movie);

        UserRepository mockUserRepo = mock(UserRepository.class);
        WatchlistRepository mockListRepo = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo = mock(MovieRepository.class);

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistIdAndExternalId(0L, "test-id")).thenReturn(Optional.of(movie));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(movieList);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.removeMovie(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals("test-id", response.getBody().getMovieIds()[0]);
    }

    @Test
    public void setPrivacyTestFail() {
        PrivacyRequest request = new PrivacyRequest();
        request.setListId(0);
        request.setPrivacy(false);

        when(mockListRepo.findById(anyLong())).thenReturn(Optional.empty());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.setPrivacy(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void setPrivacyTestEmpty() {
        PrivacyRequest request = new PrivacyRequest();
        request.setListId(0);
        request.setPrivacy(false);

        Watchlist testList = new Watchlist();
        testList.setName("test-name");
        testList.setPrivacy(true);

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(new ArrayList<Movie>());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.setPrivacy(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals(null, response.getBody().getMovieIds());
        assertEquals(false, response.getBody().getPrivacy());
    }

    @Test
    public void setPrivacyTestNonEmpty() {
        PrivacyRequest request = new PrivacyRequest();
        request.setListId(0);
        request.setPrivacy(false);

        Watchlist testList = new Watchlist();
        testList.setName("test-name");
        testList.setPrivacy(true);

        Movie movie = new Movie();
        movie.setWatchlist(testList);
        movie.setExternalId("test-id");
        List<Movie> movieList= new ArrayList<Movie>();
        movieList.add(movie);

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(movieList);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.setPrivacy(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals("test-id", response.getBody().getMovieIds()[0]);
        assertEquals(false, response.getBody().getPrivacy());
    }

    @Test
    public void renameListTestFail() {
        ListRenameRequest request = new ListRenameRequest();
        request.setListId(0);
        request.setListName("test-new-name");

        when(mockListRepo.findById(anyLong())).thenReturn(Optional.empty());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.renameList(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void renameListTestEmpty() {
        User testUser = new User();
        ListRenameRequest request = new ListRenameRequest();
        request.setListId(0);
        request.setListName("test-new-name");
        request.setUserId(testUser.getUuid());

        Watchlist testList = new Watchlist();
        testList.setName("test-old-name");
        testList.setPrivacy(false);

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(new ArrayList<Movie>());
        when(mockListRepo.findByUserUuidAndName(testUser.getUuid(), request.getListName())).thenReturn(Optional.empty());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.renameList(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-new-name", response.getBody().getListName());
        assertEquals(null, response.getBody().getMovieIds());
        assertEquals(false, response.getBody().getPrivacy());
    }

    @Test
    public void renameListTestNonEmpty() {
        User testUser = new User();
        ListRenameRequest request = new ListRenameRequest();
        request.setListId(0);
        request.setListName("test-new-name");
        request.setUserId(testUser.getUuid());

        Watchlist testList = new Watchlist();
        testList.setName("test-old-name");
        testList.setPrivacy(false);

        Movie movie = new Movie();
        movie.setWatchlist(testList);
        movie.setExternalId("test-id");
        List<Movie> movieList= new ArrayList<Movie>();
        movieList.add(movie);

        UserRepository mockUserRepo = mock(UserRepository.class);
        WatchlistRepository mockListRepo = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo = mock(MovieRepository.class);

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(movieList);
        when(mockListRepo.findByUserUuidAndName(testUser.getUuid(), request.getListName())).thenReturn(Optional.of(testList));

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.renameList(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody().getListId());
        assertEquals("test-new-name", response.getBody().getListName());
        assertEquals("test-id", response.getBody().getMovieIds()[0]);
        assertEquals(false, response.getBody().getPrivacy());
    }

    @Test
    public void renameListTestListNameExists() {
        User testUser = new User();
        ListRenameRequest request = new ListRenameRequest();
        request.setListId(0);
        request.setListName("test-new-name");
        request.setUserId(testUser.getUuid());

        Watchlist testList = new Watchlist();
        testList.setName("test-old-name");
        testList.setPrivacy(false);

        Watchlist duplicateList = mock(Watchlist.class);
        duplicateList.setName("test-new-name");
        duplicateList.setPrivacy(false);

        UserRepository mockUserRepo = mock(UserRepository.class);
        WatchlistRepository mockListRepo = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo = mock(MovieRepository.class);

        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(duplicateList.getId()).thenReturn(1L);
        when(mockListRepo.findByUserUuidAndName(testUser.getUuid(), request.getListName())).thenReturn(Optional.of(duplicateList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(new ArrayList<Movie>());

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<WatchlistResponse> response = watchlistController.renameList(request);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void getPublicWatchlistsTest() {
        Watchlist testListEmpty = new Watchlist();
        testListEmpty.setName("test-empty");
        testListEmpty.setPrivacy(false);

        Watchlist testListNonEmpty = new Watchlist();
        testListNonEmpty.setName("test-non-empty");
        testListNonEmpty.setPrivacy(false);

        List<Watchlist> testLists = new ArrayList<>();
        testLists.add(testListEmpty);
        testLists.add(testListNonEmpty);

        Movie movie = new Movie();
        movie.setWatchlist(testListNonEmpty);
        movie.setExternalId("test-id");
        List<Movie> movieList = new ArrayList<>();
        movieList.add(movie);

        when(mockListRepo.findByPrivacyFalse()).thenReturn(testLists);
        when(mockMovieRepo.findByWatchlistId(anyLong())).thenReturn(new ArrayList<Movie>()).thenReturn(movieList);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<List<WatchlistResponse>> response = watchlistController.getPublicWatchlists();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-empty", response.getBody().get(0).getListName());
        assertEquals(false, response.getBody().get(0).getPrivacy());
        assertEquals(null, response.getBody().get(0).getMovieIds());

        assertEquals("test-non-empty", response.getBody().get(1).getListName());
        assertEquals(false, response.getBody().get(1).getPrivacy());
        assertEquals("test-id", response.getBody().get(1).getMovieIds()[0]);
    }

    @Test
    public void createNewListWithMoviesTestSuccess() {
        NewListRequest request = new NewListRequest();
        User testUser = new User();

        UserRepository mockUserRepo = mock(UserRepository.class);
        WatchlistRepository mockListRepo = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo = mock(MovieRepository.class);
        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);

        request.setUuid(testUser.getUuid());
        request.setListName("test-name");
        request.setPrivacy(false);

        Watchlist testList = new Watchlist();
        testList.setName("test-name");

        Movie movie = new Movie();
        movie.setWatchlist(testList);
        movie.setExternalId("test-id");
        List<Movie> movieList= new ArrayList<Movie>();
        movieList.add(movie);

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.of(testUser));
        when(mockListRepo.findById(0L)).thenReturn(Optional.of(testList));
        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(movieList);

        List<String> requestList = new ArrayList<>();
        requestList.add("test-id");

        NewListWithMoviesRequest newListWithMoviesRequest = new NewListWithMoviesRequest();
        newListWithMoviesRequest.setNewListRequest(request);
        newListWithMoviesRequest.setMovieIds(requestList);

        ResponseEntity<WatchlistResponse> response = watchlistController.newListWithMovies(newListWithMoviesRequest);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals("test-id", response.getBody().getMovieIds()[0]);

        when(mockMovieRepo.findByWatchlistId(0L)).thenReturn(new ArrayList<Movie>());
        response = watchlistController.newListWithMovies(newListWithMoviesRequest);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-name", response.getBody().getListName());
        assertEquals(null, response.getBody().getMovieIds());
    }

    @Test
    public void createNewListWithMoviesTestFails() {
        NewListRequest request = new NewListRequest();
        UUID uuid = UUID.randomUUID();
        User testUser = new User();

        UserRepository mockUserRepo_fail = mock(UserRepository.class);
        WatchlistRepository mockListRepo_fail = mock(WatchlistRepository.class);
        MovieRepository mockMovieRepo_fail = mock(MovieRepository.class);
        watchlistController = new WatchlistController(mockUserRepo_fail, mockListRepo_fail, mockMovieRepo_fail);

        when(mockUserRepo_fail.findByUuid(uuid)).thenReturn(Optional.empty());

        request.setUuid(uuid);
        request.setListName("test-name");
        request.setPrivacy(false);

        List<String> requestList = new ArrayList<>();
        requestList.add("test-id");

        NewListWithMoviesRequest newListWithMoviesRequest = new NewListWithMoviesRequest();
        newListWithMoviesRequest.setNewListRequest(request);
        newListWithMoviesRequest.setMovieIds(requestList);

        ResponseEntity<WatchlistResponse> response = watchlistController.newListWithMovies(newListWithMoviesRequest);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void deleteListSuccess() {
        DeleteListRequest request = new DeleteListRequest();
        User testUser = new User();
        request.setUuid(testUser.getUuid());
        request.setListId(0);

        Watchlist testList = new Watchlist();
        Watchlist testList2 = new Watchlist();
        testList.setName("test-name");
        testList2.setName("test-name2");
        List<Watchlist> testWatchlistList = new ArrayList<>();
        testWatchlistList.add(testList);

        Movie movie = new Movie();
        List<Movie> testMovieList = new ArrayList<>();
        testMovieList.add(movie);

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.of(testUser));
        when(mockListRepo.existsById(testList2.getId())).thenReturn(true);
        when(mockMovieRepo.findByWatchlistId(testList2.getId())).thenReturn(testMovieList);
        when(mockListRepo.findByUserUuid(testUser.getUuid())).thenReturn(testWatchlistList);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);
        ResponseEntity<List<WatchlistResponse>> response = watchlistController.deleteList(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    public void deleteListFails() {
        DeleteListRequest request = new DeleteListRequest();
        User testUser = new User();
        request.setUuid(testUser.getUuid());
        request.setListId(0);

        Watchlist testList = new Watchlist();
        Watchlist testList2 = new Watchlist();
        testList.setName("test-name");
        testList2.setName("test-name2");
        List<Watchlist> testWatchlistList = new ArrayList<>();
        testWatchlistList.add(testList);

        Movie movie = new Movie();
        List<Movie> testMovieList = new ArrayList<>();
        testMovieList.add(movie);

        watchlistController = new WatchlistController(mockUserRepo, mockListRepo, mockMovieRepo);

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.empty());
        ResponseEntity<List<WatchlistResponse>> response = watchlistController.deleteList(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        when(mockUserRepo.findByUuid(testUser.getUuid())).thenReturn(Optional.of(testUser));
        when(mockListRepo.existsById(testList2.getId())).thenReturn(false);

        response = watchlistController.deleteList(request);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
