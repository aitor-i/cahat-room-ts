import { Input } from "../Input/Input";

import { charToNumber } from "../../utils/charToNumber";
import { useChat } from "./useChat";

export const Chat = () => {
  const { colors, isRoomData, message, roomData, submitHandler } = useChat();

  return (
    <div>
      {isRoomData && (
        <>
          <h2 className="text-3xl font-bold mb-4 ">{roomData?.roomName}</h2>
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
