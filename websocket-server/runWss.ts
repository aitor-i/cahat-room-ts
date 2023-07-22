import {} from "express";
import { MessageObject } from "./domain/MessageObject";
import { Room, Message } from "./room";
import http from "http";

// import {Server} from './index'
import { Server, WebSocket } from "ws";

export function runWss(server: http.Server, rooms: Room[]) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (messageObject: string) => {
      console.log("New message!");
      console.log("rooms", rooms);

      const parsedMessageObject: MessageObject = JSON.parse(messageObject);
      console.log("parsedMessageObject", parsedMessageObject);

      const room = rooms.find(
        (room) => room.getId() === parsedMessageObject.roomId
      );
      if (!room) throw new Error("Not room found");
      console.warn(room.getName());

      const client = room
        .getClients()
        .find((client) => client.getId() === parsedMessageObject.clientId);
      if (!client) throw new Error("Client not found!");
      console.warn(client.getName());

      const messageToAdd: Message = {
        client,
        message: parsedMessageObject.message,
      };
      room.addMessage(messageToAdd);

      console.log("Messages: \n", room.getMessages());

      const messagesString = JSON.stringify(room.getMessages());
      ws.send(messagesString);
    });
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  wss.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });

  return wss;
}