import { v4 as uuidv4 } from "uuid";
import { Client } from "./client";

interface Message {
  client: Client;
  message: string;
}

export class Room {
  private name: string;
  private id: string;
  private clients: Client[];
  private messages: Message[] = [];

  constructor(name: string) {
    this.name = name;
    this.id = uuidv4();
    this.clients = [];

    console.log(`Room ${this.name} created!`);
  }

  /**
   * getClients
   */
  public getClients() {
    return this.clients;
  }
  /**
   * addMessage
   */
  public addMessage(message: Message) {
    // TODO add user validation
    this.messages.push(message);
  }

  /**
   * getMessages
   */
  public getMessages() {
    return this.messages;
  }

  /**
   * addClient
   */
  public addClient(client: Client) {
    this.clients.push(client);

    console.log(`${client.getName()} has joined Room ${this.name}`);
  }

  /**
   * deleteClient
   */
  public deleteClient(client: Client) {
    this.clients = this.clients.filter(
      (roomClient) => roomClient.getId() !== client.getId()
    );

    console.log(`${client.getName()} has left the room ${this.name}`);
  }
  /**
   * getName
   */
  public getName() {
    return this.name;
  }

  /**
   * getId
   */
  public getId() {
    return this.id;
  }
}
