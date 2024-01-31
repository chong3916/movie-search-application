package edu.usc.csci310.project.demo.api.controllers;

import edu.usc.csci310.project.demo.api.requests.UserRequest;
import edu.usc.csci310.project.demo.api.responses.UserResponse;
import edu.usc.csci310.project.demo.db.model.User;
import edu.usc.csci310.project.demo.db.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class AuthControllerTest {

    AuthController authController;

    @Test
    public void createNewUserTestSuccess() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        UserRepository mockRepo = mock(UserRepository.class);
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("");
        authController = new AuthController(mockRepo, mockEncoder);

        ResponseEntity<UserResponse> response = authController.createNewUser(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test-username", response.getBody().getUsername());
    }

    @Test
    public void createNewUserTestFail() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");
        User dummyUser = new User("test-username", "test-password");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("");
        authController = new AuthController(mockRepo, mockEncoder);

        ResponseEntity<UserResponse> response = authController.createNewUser(request);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void loginTestSuccess() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        User dummyUser = new User("test-username", "test-password");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("test-password");
        when(mockEncoder.matches("test-password", "test-password")).thenReturn(true);
        authController = new AuthController(mockRepo, mockEncoder);

        ResponseEntity<UserResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals( "test-username", response.getBody().getUsername());
    }

    @Test
    public void loginTestFail() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        User dummyUser = new User("test-username", "test-wrongPassword");


        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("test-password");
        when(mockEncoder.matches("test-password", "test-wrongPassword")).thenReturn(false);

        authController = new AuthController(mockRepo, mockEncoder);

        ResponseEntity<UserResponse> response = authController.login(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void loginTestNoUser() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.ofNullable(null));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);

        authController = new AuthController(mockRepo, mockEncoder);

        ResponseEntity<UserResponse> response = authController.login(request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void loginTestLockUser() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        User dummyUser = new User("test-username", "test-wrongPassword");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("test-password");
        when(mockEncoder.matches("test-password", "test-wrongPassword")).thenReturn(false);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);

            authController = new AuthController(mockRepo, mockEncoder);

            dummyUser.setFailedAttempt(2);

            dummyUser.setFirstLoginAttemptTime(Instant.ofEpochSecond(100000L));
            ResponseEntity<UserResponse> response = authController.login(request);
            assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        }
    }

    @Test
    public void loginAttemptWhenUserLocked() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        User dummyUser = new User("test-username", "test-wrongPassword");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("test-password");
        when(mockEncoder.matches("test-password", "test-wrongPassword")).thenReturn(false);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);
            authController = new AuthController(mockRepo, mockEncoder);

            dummyUser.setFailedAttempt(3);
            dummyUser.setAccountNonLocked(false);

            dummyUser.setLockTime(instant);

            ResponseEntity<UserResponse> response = authController.login(request);
            assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        }
    }

    @Test
    public void loginValidAfterUnlock() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        User dummyUser = new User("test-username", "test-password");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("test-password");
        when(mockEncoder.matches("test-password", "test-password")).thenReturn(true);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);
            authController = new AuthController(mockRepo, mockEncoder);

            dummyUser.setAccountNonLocked(false);
            dummyUser.setLockTime(Instant.ofEpochSecond(0L));

            ResponseEntity<UserResponse> response = authController.login(request);
            assertEquals(HttpStatus.OK, response.getStatusCode());
        }
    }

    @Test
    public void loginInvalidAfterUnlock() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-wrongPassword");

        User dummyUser = new User("test-username", "test-password");

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("test-password");
        when(mockEncoder.matches("test-wrongPassword", "test-password")).thenReturn(false);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);
            authController = new AuthController(mockRepo, mockEncoder);

            dummyUser.setAccountNonLocked(false);
            dummyUser.setLockTime(Instant.ofEpochSecond(0L));

            ResponseEntity<UserResponse> response = authController.login(request);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }
    }

    @Test
    public void loginLockResetAfterTime() {
        UserRequest request = new UserRequest();
        request.setUsername("test-username");
        request.setPassword("test-password");

        User dummyUser = new User("test-username", "test-wrongPassword");
        dummyUser.setFailedAttempt(1);

        UserRepository mockRepo = mock(UserRepository.class);
        when(mockRepo.findByUsername(anyString())).thenReturn(Optional.of(dummyUser));
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        when(mockEncoder.encode(anyString())).thenReturn("test-password");
        when(mockEncoder.matches("test-password", "test-wrongPassword")).thenReturn(false);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);
            authController = new AuthController(mockRepo, mockEncoder);

            dummyUser.setFailedAttempt(2);
            dummyUser.setFirstLoginAttemptTime(Instant.ofEpochSecond(0L));

            ResponseEntity<UserResponse> response = authController.login(request);

            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }
    }

    @Test
    public void authLockUserTest(){
        User dummyUser = new User("test-username", "test-wrongPassword");

        UserRepository mockRepo = mock(UserRepository.class);
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);
            authController = new AuthController(mockRepo, mockEncoder);
            authController.resetFailedAttempts(dummyUser);

            dummyUser.setFirstLoginAttemptTime(Instant.ofEpochSecond(100000000L));
            boolean lockResponse = authController.lock(dummyUser); // Test when locking user is successful
            assertEquals(true, lockResponse);

            dummyUser.setFirstLoginAttemptTime(Instant.ofEpochSecond(0L));
            lockResponse = authController.lock(dummyUser); // Test when locking user is successful
            assertEquals(false, lockResponse);
        }
    }

    @Test
    public void authIncreaseFailedAttemptsTest(){
        User dummyUser = new User("test-username", "test-wrongPassword");

        UserRepository mockRepo = mock(UserRepository.class);
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);
            authController = new AuthController(mockRepo, mockEncoder);

            boolean increaseFailedAttemptsResponse = authController.increaseFailedAttempts(dummyUser); // Test when increase failed called first time
            assertEquals(true, increaseFailedAttemptsResponse);

            dummyUser.setFailedAttempt(1);
            dummyUser.setFirstLoginAttemptTime(Instant.ofEpochSecond(100000000L));
            increaseFailedAttemptsResponse = authController.increaseFailedAttempts(dummyUser); // Test when increase failed called increased failed attempts
            assertEquals(true, increaseFailedAttemptsResponse);

            dummyUser.setFailedAttempt(1);
            dummyUser.setFirstLoginAttemptTime(Instant.ofEpochSecond(0L));
            increaseFailedAttemptsResponse = authController.increaseFailedAttempts(dummyUser); // Test when failed attempts is reset
            assertEquals(false, increaseFailedAttemptsResponse);
        }
    }

    @Test
    public void authUnlockWhenTimeExpiredTest(){
        User dummyUser = new User("test-username", "test-wrongPassword");

        UserRepository mockRepo = mock(UserRepository.class);
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);

        Instant instant = Instant.ofEpochSecond(100000L);
        Clock clock = Clock.fixed(instant, ZoneOffset.UTC);
        try(MockedStatic<Clock> mockedClock = Mockito.mockStatic(Clock.class)){
            mockedClock.when(Clock::systemDefaultZone).thenReturn(clock);
            authController = new AuthController(mockRepo, mockEncoder);

            dummyUser.setLockTime(Instant.ofEpochSecond(0L));
            boolean unlockResponse = authController.unlockWhenTimeExpired(dummyUser); // test when ready to unlock user account yet
            assertEquals(true, unlockResponse);

            dummyUser.setLockTime(Instant.ofEpochSecond(100000000L));
            unlockResponse = authController.unlockWhenTimeExpired(dummyUser); // test when not ready to unlock user account yet
            assertEquals(false, unlockResponse);
        }
    }
}
