package edu.usc.csci310.project.demo.api.responses;

public class KeywordResponse {
    private String name;
    private String id;

    public KeywordResponse(String id, String name){
        this.name = name;
        this.id = id;
    }

    public void setId(String id){ this.id = id; }
    public void setName(String name){ this.name = name; }
    public String getId(){ return id; }
    public String getName(){ return name; }

}
