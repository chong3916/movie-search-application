package movie.time.project.demo.api.responses;

public class WatchlistResponse {
    private long listId;
    private String listName;
    private String[] movieIds;
    private boolean privacy;

    public long getListId() {
        return this.listId;
    }
    public void setListId(long listId) {
        this.listId = listId;
    }
    public String getListName() {
        return this.listName;
    }
    public void setListName(String listName) {
        this.listName = listName;
    }
    public String[] getMovieIds() {
        return this.movieIds;
    }
    public void setMovieIds(String[] movieIds){
        this.movieIds = movieIds;
    }
    public boolean getPrivacy() {
        return this.privacy;
    }
    public void setPrivacy(boolean privacy) {
        this.privacy = privacy;
    }
}
