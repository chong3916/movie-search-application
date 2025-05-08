package movie.time.project.demo.db.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import movie.time.project.demo.db.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //Can use JPARepository methods i.e. save(), findOne(), findById(), etc.
    //boolean existsByUsername(String username);
    //boolean existsByEmail(String email);
    Optional<User> findByUuid(UUID uuid);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.failedAttempt = ?1 WHERE u.uuid = ?2")
    void updateFailedAttempts(int failAttempts, UUID uuid);
}
