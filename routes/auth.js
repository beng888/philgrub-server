import express from "express";

import {
  register,
  update,
  login,
  logout,
  checkUserCred,
  addToCart,
  updateCart,
  clearCart,
  checkout,
  billingAddress,
  shippingAddress,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

import { secure, clearanceLevel } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/checkuser", checkUserCred);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.put("/passwordreset/:resetToken", resetPassword);

router.use(secure);
router.use(clearanceLevel("user"));

router.post("/addToCart", addToCart);
router.post("/updateCart", updateCart);
router.post("/clearCart", clearCart);
router.post("/checkout", checkout);

router.post("/billingAddress", billingAddress);
router.post("/shippingAddress", shippingAddress);

router.put("/update", update);

export default router;
