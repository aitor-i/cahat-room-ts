import { useContext } from "react";
import { Chat } from "./components/Chat/Chat";
//import { Client } from "./client";

import { JoinForm } from "./components/JoinForm/JoinForm";
import { JoinContext, JoinContextInterface} from "./contexts/join-context/JoinContext";
import { RoomData } from "./components/Chat/useChat";

function App() {
  const { roomData, setRoomData } =
    useContext<JoinContextInterface>(JoinContext);
  if (!setRoomData) throw new Error("No context");

  console.log("roomData", roomData);

  const logOutHandler = () => {
    setRoomData({} as RoomData);
    window.localStorage.removeItem("room-data");
  };

  const isRoomData = Object.keys(roomData!).length === 0;
  return (
    <div className="flex min-h-screen  flex-col bg-gray-50-50">
      <h1 className="bg-purple-800 w-screen text-4xl font-bold p-5 pl-12 text-gray-50">
        {" "}
        Chat Rooms
      </h1>
      {!isRoomData ? (
        <div className="flex flex-1 justify-between   flex-col mr-10 ml-10 mt-8">
          <Chat />
          <button
            onClick={logOutHandler}
            className="w-24 absolute top-16 right-8  mt-6 bg-red-400  p-2 rounded-lg text-gray-50 font-bold"
          >
            Log out
          </button>
        </div>
      ) : (
        <section className="flex flex-col border-1 w-fit pt-1 shadow-md rounded-sm border-gray-200 gap-4 self-center mt-24 ">
          <h2 className="w-full p-4 text-center text-2xl bg-slate-400 text-gray-50 font-bold">
            Join a room
          </h2>
          <JoinForm />
        </section>
      )}
    </div>
  );
}

export default App;
