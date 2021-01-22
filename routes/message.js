import express from "express";

import {
  createMessage,
  getMessage,
  deleteMessage,
} from "../controllers/message.js";
import { secure, clearanceLevel } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createMessage);
router.use(secure);
router.use(clearanceLevel("admin"));
router.get("/", getMessage);
router.delete("/:id", deleteMessage);

export default router;
