import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../Input/Input";

export interface RoomData {
  roomId: string;
  userId: string;
  roomName: string;
}

export const Chat = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [message, setMessage] = useState<any[]>([]);

  const { roomId, roomName, userId }: RoomData = JSON.parse(
    window.localStorage.getItem("room-data")!
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        message: formData.get("message"),
        clientId: userId,
        roomId: roomId,
      });
      socket.send(message);
    }
    event.currentTarget.reset();
  };

  useEffect(() => {
    // Create a WebSocket connection
    const newSocket = new WebSocket("ws://localhost:5004");
    setSocket(newSocket);

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

    // Cleanup function for WebSocket connection when component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div>
      <h2>{roomName}</h2>
      <section>
        {message.map((message) => (
          <div className="flex gap-3" key={Math.random()}>
            <p className="text-green-400">{message.client.name}:</p>
            <p>{message.message}</p>
          </div>
        ))}
        <form onSubmit={submitHandler}>
          <Input name="message" type="text" />
          <button
            type="submit"
            className=" p-1 pl-2 pe-2 bg-blue-600  rounded-lg text-gray-50 font-bold"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
};
