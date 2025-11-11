import axios from "axios";

export const baseURL = "http://localhost:8080";

export const httpClient = axios.create({
  baseURL: baseURL,
});

// Optional: keep your specific endpoints too
export const createRoomApi = async (roomData) => {
  return await httpClient.post("/api/v1/rooms", roomData);
};

export const joinChatApi = async (roomId, userData) => {
  return await httpClient.post(`/api/v1/rooms/${roomId}`, userData);
};
