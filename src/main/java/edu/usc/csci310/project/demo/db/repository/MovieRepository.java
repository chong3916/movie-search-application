package edu.usc.csci310.project.demo.db.repository;

import edu.usc.csci310.project.demo.db.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByWatchlistId(long id);
    void deleteByWatchlistIdAndExternalId(long id, String external);
    Optional<Movie> findByWatchlistIdAndExternalId(long id, String external);
}
