package edu.usc.csci310.project.demo.api.requests;

import java.util.UUID;

public class DeleteListRequest {
    private UUID uuid;
    private long listId;
    public UUID getUuid() {
        return this.uuid;
    }
    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }
    public long getListId() { return this.listId; }
    public void setListId(long listId) { this.listId = listId; }
}
