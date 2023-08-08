import { Input } from "../Input/Input";

import { charToNumber } from "../../utils/charToNumber";
import { useChat } from "./useChat";

export const Chat = () => {
  const { colors, isRoomData, message, roomData, submitHandler } = useChat();

  return (
    <div className="flex-1 flex flex-col "> 
            {isRoomData && (
                <div className = "flex-1  flex-col justify-between  h-full">
                    <h2 className="text-3xl font-bold mb-4 ">{roomData?.roomName}</h2>
                    <div className = "h-full flex flex-col  flex-1 justify-end flex">
                        <section className="h-96 overflow-y-scroll">
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
                        </section>
                        <form className="mt-10 self-end " onSubmit={submitHandler}>
                            <Input name="message" type="text" />
                            <button
                                type="submit"
                                className=" p-1 pl-2 pe-2 bg-blue-600  rounded-lg text-gray-50 font-bold"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
    </div>
  );
};
