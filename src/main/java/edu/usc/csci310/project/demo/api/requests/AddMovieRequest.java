package edu.usc.csci310.project.demo.api.requests;

public class AddMovieRequest {
    private long listId;
    private String movieId;

    public long getListId() {
        return this.listId;
    }
    public void setListId(long listId) {
        this.listId = listId;
    }
    public String getMovieId() {
        return this.movieId;
    }
    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }
}
