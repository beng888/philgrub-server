import express from "express";

import {
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  //   likeMenu,
} from "../controllers/menu.js";
import { secure, clearanceLevel } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getMenu);
router.use(secure);
router.use(clearanceLevel("admin"));
router.post("/", createMenu);
router.patch("/:id", updateMenu);
router.delete("/:id", deleteMenu);
// router.patch("/:id/likeMenu", likeMenu);

export default router;
