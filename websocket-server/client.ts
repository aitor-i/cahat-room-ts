import { v4 as uuidv4 } from "uuid";

export class Client {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = uuidv4();

    console.log(`Client created Name: ${name}`);
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
