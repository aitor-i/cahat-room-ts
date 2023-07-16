import { useState } from "react";
import { Chat } from "./components/Chat/Chat";
import { JoinForm } from "./components/JoinForm/JoinForm";

function App() {
  const roomData = window.localStorage.getItem("room-data");

  const logOutHandler = () => {
    window.localStorage.removeItem("room-data");
  };

  console.log(roomData);
  return (
    <div className="flex flex-col bg-gray-50-50">
      <h1 className="bg-purple-800 w-screen text-4xl font-bold p-5 pl-12 text-gray-50">
        {" "}
        Chat Rooms
      </h1>
      {roomData ? (
        <div>
          <Chat />
          <button
            onClick={logOutHandler}
            className="w-1/3 mt-6 bg-red-400  p-2 rounded-lg text-gray-50 font-bold"
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
