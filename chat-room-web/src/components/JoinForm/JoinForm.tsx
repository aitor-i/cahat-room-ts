import axios from "axios";

import { FormEvent } from "react";
import { RoomData } from "../Chat/Chat";

interface JoinData {
  username: string;
  roomName: string;
}

export const JoinForm = () => {
  const socket = new WebSocket("ws://localhost:5004");

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

    const roomData = JSON.stringify(res.data);

    window.localStorage.setItem("room-data", roomData);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col  border-1 w-fit p-10 pt-2 pb-10 border-gray-200 gap-4 "
    >
      <span className="flex flex-col gap-2">
        <label>Enter your name</label>
        <input
          name="username"
          required
          className="border-2 rounded-lg"
          type="text"
        />
      </span>
      <span className="flex flex-col gap-2">
        <span className="flex flex-col gap-2">
          <label>Enter room name</label>
          <input
            name="room-name"
            required
            className="border-2 rounded-lg"
            type="text"
          />
        </span>
      </span>
      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 p-2 rounded-lg text-gray-50 font-bold"
      >
        Join
      </button>
    </form>
  );
};
