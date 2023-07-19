import { FormEvent, useContext } from "react";
import {
  JoinContext,
  JoinContextInterface,
} from "../../contexts/join-context/JoinContext";
import axios from "axios";
import { RoomData } from "../Chat/useChat";

export interface JoinData {
  username: string;
  roomName: string;
}

export const useJoinForm = () => {
  const { roomData, setRoomData } =
    useContext<JoinContextInterface>(JoinContext);
  if (!setRoomData) throw new Error("No context");

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const roomName = formData.get("room-name") as string;
    const type = "new-connection";

    event.currentTarget.reset();

    console.log(username, roomName, type);

    const joinData: JoinData = { username, roomName };
    const res = (await axios
      .post("http://localhost:5004/join", joinData)
      .catch((error) => console.error(error))) || { data: "" };

    console.log(res.data);

    const { roomId, roomName: rName, userId }: RoomData = res.data;

    setRoomData({
      roomId,
      roomName: rName,
      userId,
      prevMessages: res.data.messages,
    });

    console.log("roomData", roomData);
  };

  return { submitHandler };
};
