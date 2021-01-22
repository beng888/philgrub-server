import express from "express";

import {
  createDelivery,
  getDelivery,
  deleteDelivery,
} from "../controllers/delivery.js";
import { secure, clearanceLevel } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getDelivery);
router.use(secure);
router.use(clearanceLevel("admin"));
router.post("/", createDelivery);
router.delete("/:id", deleteDelivery);

export default router;
