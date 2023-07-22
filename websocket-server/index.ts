import WebSocket, { Server } from "ws";

import express, { Express, Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Client } from "./client";
import { Message, Room } from "./room";
import { runWss } from "./runWss";

import { MessageObject } from "./domain/MessageObject";
import { JoinData } from "./domain/JoinData";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5004;

const rooms: Room[] = [];

const server = app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});

const wss = runWss(server, rooms);

app.get("/", (req, res) => {
  console.log("Get called");
  res.send(`WebSocket server is running on port ${port}! `);
});

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
