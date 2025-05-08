package movie.time.project.demo.db.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date created_at;

    @UpdateTimestamp
    @Column(name = "last_modified")
    private Date last_modified;

    @Column(name = "external_id")
    private String externalId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "list_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Watchlist watchlist;

    public Movie() {}

    public String getExternalId() {
        return this.externalId;
    }
    public void setExternalId(String external_id) {
        this.externalId = external_id;
    }
    public void setWatchlist(Watchlist watchlist) {
        this.watchlist = watchlist;
    }
}
