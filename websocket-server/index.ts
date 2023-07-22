import WebSocket from "ws";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Client } from "./client";
import { Message, Room } from "./room";

interface MessageObject {
  message: string;
  clientId: string;
  roomId: string;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5004;

const rooms: Room[] = [];

function joinRoom(username: string, roomName: string) {
  let room = rooms.find((room) => room.getName() === roomName);
  if (!room) {
    const newRoom = new Room(roomName);
    rooms.push(newRoom);
    room = newRoom;
  }

  let client = room
    .getClients()
    .find((client) => client.getName() === username);

  if (!client) {
    client = new Client(username);
    room.addClient(client);
  }

  const roomData: ChatRoomData = {
    roomId: room.getId(),
    userId: client.getId(),
    messages: room.getMessages(),
  };

  return roomData;
}

const server = app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});

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

app.get("/", (req, res) => {
  console.log("Get called");
  res.send(`WebSocket server is running on port ${port}! `);
});

interface JoinData {
  username: string;
  roomName: string;
}

app.post("/join", (req, res) => {
  console.log("Join");

  try {
    console.log("req.body", req.body);
    const { roomName, username }: JoinData = req.body;
    console.log(roomName, username);

    let room = rooms.find((room) => room.getName() === roomName);
    if (!room) {
      const newRoom = new Room(roomName);
      rooms.push(newRoom);
      room = newRoom;
    }

    let client = room
      .getClients()
      .find((client) => client.getName() === username);

    if (!client) {
      client = new Client(username);
      room.addClient(client);
    }

    res.status(201).send({
      roomId: room.getId(),
      userId: client.getId(),
      roomName: room.getName(),
      messages: room.getMessages(),
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use("*", (req, res) => {
  console.log("Not found");
  console.log(req.url);

  res.status(404).send("Not Found");
});
interface ChatRoomData {
  roomId: string;
  userId: string;
  messages: Message[];
}

// const socket = new WebSocket("ws://localhost:5004");

// socket.on("open", () => {
//   const messageObject: MessageObject = {
//     message: "Hello!",
//     clientId: "123",
//     roomId: "123",
//   };

//   socket.send(JSON.stringify(messageObject));
// });

// socket.addEventListener("message", (message: WebSocket.MessageEvent) => {
//   console.log("res: ", message.data);
// });

// socket.addEventListener("message", () => {

//   //   console.log("Connected to the server!");
// });
