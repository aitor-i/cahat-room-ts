import { FormEvent, useContext, useEffect, useState } from "react";
import {
  JoinContext,
  JoinContextInterface,
  Message,
} from "../../contexts/join-context/JoinContext";

export interface RoomData {
  roomId: string;
  userId: string;
  roomName: string;
  prevMessages: Message[];
}

export const useChat = () => {
  const { roomData } = useContext<JoinContextInterface>(JoinContext);

  const [socket, setSocket] = useState<WebSocket>();
  const [message, setMessage] = useState<Message[]>([]);

  if (message.length === 0 && roomData?.prevMessages) {
    setMessage(roomData.prevMessages);
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        message: formData.get("message"),
        clientId: roomData?.userId,
        roomId: roomData?.roomId,
      });
      socket.send(message);
    }
    event.currentTarget.reset();
  };

  useEffect(() => {
    // Create a WebSocket connection
    const newSocket = new WebSocket("ws://localhost:5004");

    // Event handler for WebSocket open event
    newSocket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    // Event handler for WebSocket message event
    newSocket.onmessage = (event) => {
      setMessage(JSON.parse(event.data));
    };

    // Event handler for WebSocket close event
    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    setSocket(newSocket);

    // Cleanup function for WebSocket connection when component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  const colors = [
    "text-green-300",
    "text-blue-400",
    "text-yellow-500",
    "text-red-600",
    "text-indigo-400",
    "text-pink-300",
    "text-purple-500",
    "text-teal-400",
    "text-orange-500",
    "text-gray-400",
  ];

  const isRoomData = Object.keys(roomData!).length !== 0;

  return { colors, isRoomData, submitHandler, message, roomData };
};
