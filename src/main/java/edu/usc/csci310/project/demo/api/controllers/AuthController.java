package edu.usc.csci310.project.demo.api.controllers;

import edu.usc.csci310.project.demo.api.requests.UserRequest;
import edu.usc.csci310.project.demo.api.responses.UserResponse;
import edu.usc.csci310.project.demo.db.model.User;
import edu.usc.csci310.project.demo.db.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Clock;
import java.time.Instant;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final long LOCK_TIME_DURATION = 30 * 1000; // 30 seconds
    private final Clock clock;
    UserRepository userRepository;
    BCryptPasswordEncoder passwordEncoder;
    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        clock = Clock.systemDefaultZone();
    }


    @PostMapping("/signup")
    public ResponseEntity<UserResponse> createNewUser(@RequestBody UserRequest request) {
        String encoded = passwordEncoder.encode(request.getPassword());

        User user = new User(request.getUsername(), encoded);
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setUuid(user.getUuid());
        response.setUsername(user.getUsername());

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {

        Optional<User> foundUser = userRepository.findByUsername(request.getUsername());
        if (!foundUser.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        else if(foundUser.get().isAccountNonLocked()) {
            if (passwordEncoder.matches(request.getPassword(), foundUser.get().getPassword())) {
                UserResponse response = new UserResponse();
                response.setUuid(foundUser.get().getUuid());
                response.setUsername(foundUser.get().getUsername());
                resetFailedAttempts(foundUser.get());
                return ResponseEntity.ok().body(response);
            }
            else if(foundUser.get().getFailedAttempt() < MAX_FAILED_ATTEMPTS - 1){ // Failed login, but don't lock account
                increaseFailedAttempts(foundUser.get());
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            else{
                boolean locked = lock(foundUser.get());

                if (locked) { // attempt was made less than a minute since the first attempt
                    return new ResponseEntity<>(HttpStatus.TOO_MANY_REQUESTS);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
        }
        else{
            boolean unlockResponse = unlockWhenTimeExpired(foundUser.get());
            if(unlockResponse) { // unlocked
                if (passwordEncoder.matches(request.getPassword(), foundUser.get().getPassword())) { // if password is correct
                    UserResponse response = new UserResponse();
                    response.setUuid(foundUser.get().getUuid());
                    response.setUsername(foundUser.get().getUsername());
                    resetFailedAttempts(foundUser.get());
                    return ResponseEntity.ok().body(response);
                }
                else{ // if password is incorrect
                    foundUser.get().setFirstLoginAttemptTime(Instant.now());
                    userRepository.updateFailedAttempts(1, foundUser.get().getUuid());
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    public boolean increaseFailedAttempts(User user) {
        if(user.getFailedAttempt() == 0){
            user.setFirstLoginAttemptTime(Instant.now());
            userRepository.updateFailedAttempts(1, user.getUuid());
            return true;
        }
        else {
            long firstLoginAttemptTime = user.getFirstLoginAttemptTime().toEpochMilli();
            long currentTimeInMillis = clock.millis();

            if (firstLoginAttemptTime + 60000 > currentTimeInMillis) { // attempt was made less than a minute since the first attempt
                int newFailAttempts = user.getFailedAttempt() + 1;
                userRepository.updateFailedAttempts(newFailAttempts, user.getUuid());
                return true;
            } else {
                user.setFirstLoginAttemptTime(Instant.now());
                userRepository.updateFailedAttempts(1, user.getUuid());
                return false;
            }
        }
    }

    public void resetFailedAttempts(User user) {
        //user.setFirstLoginAttemptTime(Instant.now());
        userRepository.updateFailedAttempts(0, user.getUuid());
    }

    public boolean lock(User user) {
        long firstLoginAttemptTime = user.getFirstLoginAttemptTime().toEpochMilli();
        long currentTimeInMillis = clock.millis();

        if (firstLoginAttemptTime + 60000 > currentTimeInMillis) { // attempt was made less than a minute since the first attempt
            user.setAccountNonLocked(false);
            user.setLockTime(Instant.now());

            userRepository.save(user);
            return true;
        } else {
            user.setFirstLoginAttemptTime(Instant.now());
            userRepository.updateFailedAttempts(1, user.getUuid());
            return false;
        }
    }

    public boolean unlockWhenTimeExpired(User user) {
        long lockTimeInMillis = user.getLockTime().toEpochMilli();
        long currentTimeInMillis = clock.millis();

        if (lockTimeInMillis + LOCK_TIME_DURATION < currentTimeInMillis) {
            user.setAccountNonLocked(true);
            user.setLockTime(null);
            user.setFailedAttempt(0);

            userRepository.save(user);
            return true;
        }

        return false;
    }
}
