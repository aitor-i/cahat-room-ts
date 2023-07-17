import { ReactNode, createContext, useState } from "react";
import { RoomData } from "../../components/Chat/Chat";

export const JoinContext = createContext<JoinContextInterface>({});

export interface JoinContextInterface {
  setRoomData?: (data: RoomData) => void;
  roomData?: RoomData;
}
interface Props {
  children: ReactNode;
}

export const JoinContextProvider = ({ children }: Props) => {
  const [roomData, setRoomData] = useState<RoomData>({} as RoomData);

  const setRoomDataHandler = (data: RoomData) => {
    console.log("data ***", data);
    setRoomData(data);
  };

  console.log("roomData **", roomData);

  return (
    <JoinContext.Provider value={{ roomData, setRoomData: setRoomDataHandler }}>
      {children}
    </JoinContext.Provider>
  );
};
