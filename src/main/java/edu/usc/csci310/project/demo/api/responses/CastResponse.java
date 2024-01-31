package edu.usc.csci310.project.demo.api.responses;

public class CastResponse {
    private String id;
    private PersonResponse[] cast;
    private PersonResponse[] crew;

    public CastResponse(String id, PersonResponse[] cast, PersonResponse[] crew){
        this.id = id;
        this.cast = cast;
        this.crew = crew;
    }

    public String getId(){ return id; }
    public PersonResponse[] getCast(){ return cast; }
    public PersonResponse[] getCrew(){ return crew; }

    public void setId(String id){ this.id = id; }
    public void setCast(PersonResponse[] cast){ this.cast = cast; }
    public void setCrew(PersonResponse[] crew){ this.crew = crew; }
}
