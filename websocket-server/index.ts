import express  from "express";

import WebSocket  from "ws";
import cors from "cors";
import bodyParser from "body-parser";

import {router} from './routers/router'

import { runWss } from "./runWss";
import {Rooms} from './domain/Room'

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("", router)
export const port = 5004;


export const rooms = new Rooms();

const clients = new Set<WebSocket>();

const server = app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});


runWss(server,  clients);

app.use("*", (req, res) => {
  console.log("Not found");
  console.log(req.url);

  res.status(404).send("Not Found");
});
