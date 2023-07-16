import React, { useState } from "react";

export interface RoomData {
  roomId: string;
  userId: string;
  roomName: string;
}

export const Chat = () => {
  const { roomId, roomName, userId }: RoomData = JSON.parse(
    window.localStorage.getItem("room-data")!
  );
  return (
    <div>
      <h2>{roomName}</h2>
    </div>
  );
};
