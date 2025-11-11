import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({ roomId: "", userName: "" });
  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const handleFormInputChange = (e) => {
    setDetail({ ...detail, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!detail.roomId.trim() || !detail.userName.trim()) {
      toast.error("Please enter both Room ID and Username");
      return false;
    }
    return true;
  };

  const joinChat = async () => {
    if (!validateForm()) return;
    try {
      const room = await joinChatApi(detail.roomId);
      toast.success("Joined room successfully!");
      setCurrentUser(detail.userName);
      setRoomId(room.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error.status === 400) toast.error(error.response.data);
      else toast.error("Error joining room");
    }
  };

  const createRoom = async () => {
    if (!validateForm()) return;
    try {
      const response = await createRoomApi(detail.roomId);
      toast.success("Room created successfully!");
      setCurrentUser(detail.userName);
      setRoomId(response.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error.status === 400) toast.error("Room already exists!");
      else toast.error("Error creating room");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={chatIcon} alt="Chat" className="w-20 h-20 animate-pulse" />
          <h1 className="text-3xl font-semibold mt-3">Chat Connect</h1>
          <p className="text-gray-400 text-sm mt-1">
            Join a room or create your own to start chatting instantly
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label htmlFor="userName" className="block text-gray-300 mb-2 font-medium">
              Your Name
            </label>
            <input
              id="userName"
              name="userName"
              value={detail.userName}
              onChange={handleFormInputChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="roomId" className="block text-gray-300 mb-2 font-medium">
              Room ID / New Room ID
            </label>
            <input
              id="roomId"
              name="roomId"
              value={detail.roomId}
              onChange={handleFormInputChange}
              placeholder="Enter or create a Room ID"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-3 pt-3">
            <button
              onClick={joinChat}
              className="flex-1 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-blue-500/30"
            >
              Join Room
            </button>
            <button
              onClick={createRoom}
              className="flex-1 bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-orange-500/30"
            >
              Create Room
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JoinCreateChat;
