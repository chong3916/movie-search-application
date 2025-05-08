package movie.time.project.demo.controllers;

import movie.time.project.demo.api.requests.UserRequest;
import movie.time.project.demo.api.responses.UserResponse;
import movie.time.project.demo.db.model.User;
import movie.time.project.demo.db.repository.UserRepository;
import movie.time.project.demo.api.controllers.UserController;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    UserController userController;

    @Test
    public void getUserByUUIDTestSuccess() {
        User user = new User("test-username", "test-password", "test-email");
        UUID uuid = user.getUuid();

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUuid(uuid)).thenReturn(Optional.of(user));
        userController = new UserController(mockRepo);

        ResponseEntity<UserResponse> response = userController.getUserByUUID(uuid);
        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody().getUuid(), uuid);
        assertEquals(response.getBody().getUsername(), "test-username");
    }
    @Test
    public void getUserByUUIDTestFail() {
        UUID uuid = UUID.randomUUID();

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUuid(uuid)).thenReturn(Optional.ofNullable(null));
        userController = new UserController(mockRepo);

        ResponseEntity<UserResponse> response = userController.getUserByUUID(uuid);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
    }
    @Test
    public void getAllUsersTestEmpty() {
        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findAll()).thenReturn(new ArrayList<>());
        userController = new UserController(mockRepo);

        ResponseEntity<List<UserResponse>> response = userController.getAllUsers();

        assertEquals(response.getStatusCode(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @Test
    public void getAllUsersTestSuccess() {
        UserRepository mockRepo = mock(UserRepository.class);
        User userOne = new User("test-username1", "test-password1", "test-email1");
        User userTwo = new User("test-username2", "test-password2", "test-email2");
        User userThree = new User("test-username3", "test-password3", "test-email3");
        List<User> userList = Arrays.asList(userOne, userTwo, userThree);
        when(mockRepo.findAll()).thenReturn(userList);
        userController = new UserController(mockRepo);

        ResponseEntity<List<UserResponse>> response = userController.getAllUsers();

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        for (int i = 0; i < 3; i++) {
            assertEquals(response.getBody().get(i).getUsername(), "test-username" + (i+1));
        }
    }

    @Test
    public void updateUserSuccess() {
        User user = new User();
        UUID uuid = user.getUuid();

        UserRequest request = new UserRequest();
        request.setUsername("test-updateUsername");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUuid(uuid)).thenReturn(Optional.of(user));
        userController = new UserController(mockRepo);

        ResponseEntity<UserResponse> response = userController.updateUser(uuid, request);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody().getUsername(), "test-updateUsername");
    }

    @Test
    public void updateUserFail() {
        UUID uuid = UUID.randomUUID();

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUuid(uuid)).thenReturn(Optional.ofNullable(null));
        userController = new UserController(mockRepo);

        UserRequest request = new UserRequest();

        ResponseEntity<UserResponse> response = userController.updateUser(uuid, request);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
    }
}
