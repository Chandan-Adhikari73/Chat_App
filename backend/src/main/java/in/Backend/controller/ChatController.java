package in.Backend.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import in.Backend.entities.Message;
import in.Backend.entities.Room;
import in.Backend.payload.MessageRequest;
import in.Backend.repositories.RoomRepository;

@Controller
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // For sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}")  // Client sends message to /app/sendMessage/{roomId}
    @SendTo("/topic/room/{roomId}")           // Message will be broadcast to all subscribers
    public Message sendMessage(
            @DestinationVariable String roomId,
            MessageRequest request  // ✅ Removed @RequestBody (not used with WebSocket)
    ) {

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            throw new RuntimeException("Room not found!");
        }

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        room.getMessages().add(message);
        roomRepository.save(room);

        return message;
    }
}
