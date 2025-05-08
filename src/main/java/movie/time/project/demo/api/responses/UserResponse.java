package movie.time.project.demo.api.responses;

import java.util.UUID;

public class UserResponse {
    //Members-----------------------------------------------------------
    private UUID uuid;
    private String username;

    //Constructors------------------------------------------------------

    //Getters/Setters---------------------------------------------------
    public UUID getUuid() {
        return this.uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
