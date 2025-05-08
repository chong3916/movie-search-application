package movie.time.project.demo.db.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table(name="watchlists")
public class Watchlist {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date created_at;

    @UpdateTimestamp
    @Column(name = "last_modified")
    private Date last_modified;

    @Column(name = "name")
    private String name;

    @Column(name = "privacy")
    private boolean privacy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "uuid")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    public Watchlist() {}

    public long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public boolean getPrivacy() {
        return this.privacy;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setPrivacy(boolean privacy) {
        this.privacy = privacy;
    }
}
