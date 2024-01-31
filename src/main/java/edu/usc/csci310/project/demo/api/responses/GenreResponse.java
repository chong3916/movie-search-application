package edu.usc.csci310.project.demo.api.responses;

public class GenreResponse {
    private String id;
    private String name;

    public GenreResponse(String id, String name){
        this.id = id;
        this.name = name;
    }

    public String getId(){
        return id;
    }
    public String getName(){
        return name;
    }

    public void setId(String id){
        this.id = id;
    }
    public void setName(String name){
        this.name = name;
    }
}
