package edu.usc.csci310.project.demo.api.requests;

import java.util.UUID;

public class NewListRequest {
    private UUID uuid;
    private String listName;
    private boolean privacy;

    public String getListName() {
        return this.listName;
    }
    public void setListName(String listName) {
        this.listName = listName;
    }
    public boolean getPrivacy() {
        return this.privacy;
    }
    public void setPrivacy(boolean privacy) {
        this.privacy = privacy;
    }
    public UUID getUuid() {
        return this.uuid;
    }
    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }
}
