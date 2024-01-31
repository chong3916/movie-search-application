package edu.usc.csci310.project.demo.api.requests;


import java.util.List;

public class NewListWithMoviesRequest {
    private NewListRequest newListRequest;
    private List<String> movieIds;

    public void setNewListRequest(NewListRequest newListRequest) { this.newListRequest = newListRequest; }
    public NewListRequest getNewListRequest() { return newListRequest; }
    public void setMovieIds(List<String> movieIds) { this.movieIds = movieIds; }
    public List<String> getMovieIds() { return movieIds; }
}
