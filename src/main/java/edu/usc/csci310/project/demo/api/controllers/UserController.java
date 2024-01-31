package edu.usc.csci310.project.demo.api.controllers;

import edu.usc.csci310.project.demo.api.requests.UserRequest;
import edu.usc.csci310.project.demo.api.responses.UserResponse;
import edu.usc.csci310.project.demo.db.model.User;
import edu.usc.csci310.project.demo.db.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api")
public class UserController {

    UserRepository userRepository;
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserByUUID(@PathVariable("id") UUID uuid) {
        Optional<User> foundUser = userRepository.findByUuid(uuid);

        if (foundUser.isPresent()) {
            UserResponse response = new UserResponse();
            User user = foundUser.get();
            response.setUuid(user.getUuid());
            response.setUsername(user.getUsername());
            return ResponseEntity.ok().body(response);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> responses = new ArrayList<>();
        List<User> foundUsers = userRepository.findAll();
        if (foundUsers.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        for (User u : foundUsers) {
            UserResponse response = new UserResponse();
            response.setUuid(u.getUuid());
            response.setUsername(u.getUsername());
            responses.add(response);
        }
        return ResponseEntity.ok().body(responses);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable("id") UUID uuid, @RequestBody UserRequest request) {
        Optional<User> foundUser = userRepository.findByUuid(uuid);

        if (foundUser.isPresent()) {
            User user = foundUser.get();
            UserResponse response = new UserResponse();

            //TODO: Check for null fields, reply with BAD_REQUEST
            String username = request.getUsername();
            user.setUsername(username);
            response.setUsername(username);

            userRepository.save(user);


            return ResponseEntity.ok().body(response);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
