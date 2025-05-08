package movie.time.project.demo.api.controllers;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import movie.time.project.demo.api.requests.UserRequest;
import movie.time.project.demo.api.responses.UserResponse;
import movie.time.project.demo.db.model.User;
import movie.time.project.demo.db.repository.UserRepository;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8080")
@Controller
@RequestMapping("/api/auth")
public class AuthController {
    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final long LOCK_TIME_DURATION = 30 * 1000; // 30 seconds
    private final Clock clock;

    private final String siteURL = "https://localhost:8080";

    UserRepository userRepository;
    BCryptPasswordEncoder passwordEncoder;
    private JavaMailSender mailSender;
    private MailHelper mailHelper;

    @Value("${spring.mail.from}")
    private String fromAddress;
    @Value("${spring.mail.username}")
    private String senderName;


    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JavaMailSender mailSender, MailHelper mailHelper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.mailHelper = mailHelper;
        clock = Clock.systemDefaultZone();
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> createNewUser(@RequestBody UserRequest request) throws MessagingException, UnsupportedEncodingException {
        String encoded = passwordEncoder.encode(request.getPassword());

        User user = new User(request.getUsername(), encoded, request.getEmail());
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String randomCode = RandomString.make(64);
        user.setVerificationCode(randomCode);
        user.setEnabled(false);

        userRepository.save(user);

        sendVerificationEmail(user, siteURL);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify")
    public String verifyUser(@RequestParam("code") String verificationCode) {
        Optional<User> user = userRepository.findByVerificationCode(verificationCode);
        if(!user.isPresent()) {
            return "redirect:/?verified=failure";
        }

        User userEntity = user.get();
        if(userEntity.isEnabled()) {
            return "redirect:/?verified=failure";
        }

        userEntity.setEnabled(true);
        userRepository.save(userEntity);

        UserResponse response = new UserResponse();
        response.setUuid(userEntity.getUuid());
        response.setUsername(userEntity.getUsername());

        return "redirect:/?verified=success";
    }

    private void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + senderName;


        content = content.replace("[[name]]", user.getUsername());
        String verifyURL = siteURL + "/api/auth/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        mailHelper.sendVerificationEmail(fromAddress, senderName, toAddress, subject, content, true);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest request) {
        Optional<User> foundUser = userRepository.findByEmail(request.getEmail());
        if (!foundUser.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else if(!foundUser.get().isEnabled()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
