import { MessageObject } from "./domain/MessageObject";
import {  Message } from "./room";
import http from "http";

import { rooms } from ".";
import {  WebSocket } from "ws";

export function runWss(
  server: http.Server,
  clients: Set<WebSocket>
) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);

    ws.on("message", (messageObject: string) => {
      console.log("New message!");
      console.log("rooms", rooms.getRooms());

      const parsedMessageObject: MessageObject = JSON.parse(messageObject);
      console.log("parsedMessageObject", parsedMessageObject);

      const room = rooms.getRooms().find(
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

      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(messagesString);
        }
      });

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
