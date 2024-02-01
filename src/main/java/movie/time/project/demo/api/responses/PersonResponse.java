package movie.time.project.demo.api.responses;

// PersonResponse java object to convert json objects
// Variables in class must match with json keys in database
public class PersonResponse {
    private String name;
    private String profile_path;
    private String known_for_department;
    private String id;
    private String character;
    private String job;
    private int order;

    public PersonResponse(String name, String profile_path, String known_for_department, String id, String character, String job, int order){
        this.name = name;
        if(profile_path == null){
            this.profile_path = null;
        }
        else {
            this.profile_path = "https://image.tmdb.org/t/p/w500" + profile_path;
        }
        this.known_for_department = known_for_department;
        this.id = id;
        this.character = character;
        this.order = order;
        this.job = job;
    }

    public void setOrder(int order){ this.order = order; }
    public void setCharacter(String character){ this.character = character; }
    public void setJob(String job){ this.job = job; }
    public void setName(String name){ this.name = name; }
    public void setProfilePath(String profile_path){
        if(profile_path != null) {
            this.profile_path = "https://image.tmdb.org/t/p/w500" + profile_path;
        }
    }
    public void setKnownForDepartment(String known_for_department){ this.known_for_department = known_for_department; }
    public void setPersonId(String id){ this.id = id; }

    public String getName(){ return name; }
    public String getProfilePath(){ return profile_path; }
    public String getKnownForDepartment(){ return known_for_department; }

    public String getPersonId(){ return id; }
    public String getJob(){ return job; }

    public String getCharacter(){ return character; }
    public int getOrder(){ return order; }
}
