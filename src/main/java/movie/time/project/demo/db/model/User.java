package movie.time.project.demo.db.model;

import movie.time.project.demo.security.AttributeEncryptor;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "\"User\"")
public class User {

    //Columns-----------------------------------------------------------
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "account_non_locked")
    private boolean accountNonLocked;

    @Column(name = "failed_attempt")
    private int failedAttempt;

    @Column(name = "first_login_attempt_time")
    private Instant firstLoginAttemptTime;
    @Column(name = "lock_time")
    private Instant lockTime;
    @Column(name = "uuid", columnDefinition = "uuid", unique = true)
    private UUID uuid = UUID.randomUUID();

    @CreationTimestamp
    @Column(name = "created_at")
    private Date created_at;

    @UpdateTimestamp
    @Column(name = "last_modified")
    private Date last_modified;

    @Column(name = "username")
    @Convert(converter = AttributeEncryptor.class)
    private String username;

    @Column(name = "email")
    @Convert(converter = AttributeEncryptor.class)
    private String email;

    @Column(name = "password")
    private String password;
    //Constructors------------------------------------------------------
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.accountNonLocked = true;
        this.failedAttempt = 0;
    }

    @Column(name = "verification_code", length = 64)
    private String verificationCode;

    private boolean enabled;

    public User() {

    }

    //Getters/Setters---------------------------------------------------

    public UUID getUuid() {
        return this.uuid;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public boolean isAccountNonLocked() {
        return this.accountNonLocked;
    }

    public int getFailedAttempt() { return this.failedAttempt; }

    public Instant getLockTime() { return this.lockTime; }

    public Instant getFirstLoginAttemptTime() { return this.firstLoginAttemptTime; }

    public void setAccountNonLocked(boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }

    public void setLockTime(Instant lockTime) { this.lockTime = lockTime; }

    public void setFailedAttempt(int failedAttempt) { this.failedAttempt = failedAttempt; }

    public void setFirstLoginAttemptTime(Instant firstLoginAttemptTime) { this.firstLoginAttemptTime = firstLoginAttemptTime; }

    public String getVerificationCode() { return this.verificationCode; }

    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public boolean isEnabled() { return this.enabled; }

    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    //TODO: Password Auth
}
