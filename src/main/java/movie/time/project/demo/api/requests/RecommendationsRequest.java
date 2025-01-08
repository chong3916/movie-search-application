package movie.time.project.demo.api.requests;

public class RecommendationsRequest {
    private String[] movieIds;
    private int count;

    public String[] getMovieIds() { return movieIds; }
    public int getCount() { return count; }
    public void setMovieIds(String[] movieIds) { this.movieIds = movieIds; }
    public void setCount(int count) { this.count = count; }
}
