package edu.usc.csci310.project.demo.db.repository;

import edu.usc.csci310.project.demo.db.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUserUuid(UUID userId);
    List<Watchlist> findByPrivacyFalse();
    Optional<Watchlist> findByUserUuidAndName(UUID userId, String name);
    void deleteWatchlistById(long listId);
}
