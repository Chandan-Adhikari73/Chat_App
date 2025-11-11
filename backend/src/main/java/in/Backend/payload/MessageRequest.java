package in.Backend.payload;

public class MessageRequest {

    private String content;
    private String sender;
    private String roomId;

    public MessageRequest() {}

    public MessageRequest(String content, String sender, String roomId) {
        this.content = content;
        this.sender = sender;
        this.roomId = roomId;
    }

    // Explicit getters
    public String getContent() {
        return content;
    }

    public String getSender() {
        return sender;
    }

    public String getRoomId() {
        return roomId;
    }

    // Explicit setters
    public void setContent(String content) {
        this.content = content;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }
}
