import { FormEvent, useContext, useEffect, useState } from "react";
import { Input } from "../Input/Input";
import {
  JoinContext,
  JoinContextInterface,
} from "../../contexts/join-context/JoinContext";

import { charToNumber } from "../../utils/charToNumber";

export interface RoomData {
  roomId: string;
  userId: string;
  roomName: string;
}

export const Chat = () => {
  const { roomData } = useContext<JoinContextInterface>(JoinContext);

  console.log("roomData", roomData);

  const [socket, setSocket] = useState<WebSocket>();
  const [message, setMessage] = useState<any[]>([]);

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

  return (
    <div>
      {isRoomData && (
        <>
          <h2 className="text-3xl font-bold mb-4">{roomData?.roomName}</h2>
          <section>
            {message.map((message) => {
              const id = message.client.id as string;
              const idLastChar = id.charAt(id.length - 1);
              const number = charToNumber(idLastChar);
              return (
                <div className="flex gap-3" key={Math.random()}>
                  <p className={colors[number]}>{message.client.name}:</p>
                  <p>{message.message}</p>
                </div>
              );
            })}
            <form className="mt-4" onSubmit={submitHandler}>
              <Input name="message" type="text" />
              <button
                type="submit"
                className=" p-1 pl-2 pe-2 bg-blue-600  rounded-lg text-gray-50 font-bold"
              >
                Send
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
};
