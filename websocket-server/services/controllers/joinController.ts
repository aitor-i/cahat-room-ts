import {Request, Response} from 'express'

import { Client } from "../../client";
import { JoinData } from "../../domain/JoinData";
import { Room } from "../../room";
import { rooms } from '../..';

export const joinController = function (req: Request, res: Response) { 
  console.log("Join");

  try {
    console.log("req.body", req.body);
    const { roomName, username }: JoinData = req.body;
    console.log(roomName, username);

    let room = rooms.getRooms().find((room) => room.getName() === roomName);
    if (!room) {
      const newRoom = new Room(roomName);
      rooms.setRooms(newRoom);
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

} 
