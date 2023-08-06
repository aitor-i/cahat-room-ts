import express from 'express';

import {port} from '../index';
import { joinController } from '../services/controllers/joinController';

export const router = express.Router();

router.get("/", (req, res) => {
  console.log("Get called");
  res.send(`WebSocket server is running on port ${port}! `);
});

router.post("/join", joinController );

