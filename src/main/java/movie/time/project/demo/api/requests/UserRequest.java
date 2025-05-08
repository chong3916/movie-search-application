package movie.time.project.demo.api.requests;

public class UserRequest {
    //Members-----------------------------------------------------------
    private String username;
    private String password;
    private String email;

    //Constructors------------------------------------------------------


    //Getters/Setters---------------------------------------------------

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
