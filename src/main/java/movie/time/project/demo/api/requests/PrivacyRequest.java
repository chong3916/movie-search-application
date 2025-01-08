package movie.time.project.demo.api.requests;

public class PrivacyRequest {
    private long listId;
    private boolean privacy;

    public long getListId() {
        return listId;
    }
    public void setListId(long listId) {
        this.listId = listId;
    }
    public boolean getPrivacy() {
        return privacy;
    }
    public void setPrivacy(boolean privacy) {
        this.privacy = privacy;
    }
}
