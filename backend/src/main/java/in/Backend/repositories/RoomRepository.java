package in.Backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import in.Backend.entities.Room;

public interface RoomRepository extends MongoRepository<Room, String>{

	Room findByRoomId(String roomId);
}
