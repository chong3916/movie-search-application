package edu.usc.csci310.project.demo.api.requests;

import java.util.UUID;

public class ListRenameRequest {
    private long listId;
    private String listName;
    private UUID userId;

    public long getListId() {
        return listId;
    }
    public void setListId(long listId) {
        this.listId = listId;
    }
    public String getListName() {
        return listName;
    }
    public void setListName(String listName) {
        this.listName = listName;
    }
    public UUID getUserId() { return this.userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}
