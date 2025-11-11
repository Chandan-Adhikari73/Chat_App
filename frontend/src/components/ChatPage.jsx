import React, { useEffect, useRef, useState } from "react";
import { MdSend, MdExitToApp } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    }
    if (connected && roomId) loadMessages();
  }, [roomId, connected]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    let client;
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected && roomId) connectWebSocket();

    return () => {
      if (client) client.disconnect();
      setStompClient(null);
    };
  }, [roomId, connected]);

  const sendMessage = () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId,
      };
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
    }
  };

  const handleLogout = () => {
    if (stompClient) stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-gray-950/60 backdrop-blur-md shadow-md">
        <div>
          <h1 className="text-lg font-semibold">
            Room: <span className="text-blue-400">{roomId}</span>
          </h1>
        </div>
        <div>
          <h1 className="text-lg font-semibold">
            User: <span className="text-green-400">{currentUser}</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-full"
        >
          <MdExitToApp size={20} /> Leave Room
        </button>
      </header>

      {/* Chat Messages */}
      <main
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
      >
        {messages.map((message, index) => {
          const isMine = message.sender === currentUser;
          return (
            <div
              key={index}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-lg ${
                  isMine
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                <div className="flex flex-col">
                  {!isMine && (
                    <p className="text-sm font-semibold text-green-400 mb-1">
                      {message.sender}
                    </p>
                  )}
                  <p className="break-words">{message.content}</p>
                  <p className="text-xs text-gray-300 mt-1 self-end">
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Input Bar */}
      <div className="px-8 py-4 bg-gray-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 bg-gray-800 rounded-full px-5 py-2 shadow-lg">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition"
          >
            <MdSend size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
