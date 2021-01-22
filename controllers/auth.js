import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisify } from "util";
import dotenv from "dotenv";
import crypto from "crypto";

import { handleErrors } from "../utils/DBError.js";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const JWT_EXPIRATION_MSEC = process.env.JWT_EXPIRATION_MSEC;

//=================================//
//************** USER *************//
//=================================//

//* JWT

export const decryptJwt = async (token) => {
  const jwtVerify = promisify(jwt.verify);
  return await jwtVerify(token, JWT_SECRET);
};

const signJwt = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

const sendToken = (user, statusCode, req, res) => {
  const token = signJwt(user._id);
  const options = {
    expires: new Date(Date.now() + JWT_EXPIRATION_MSEC),
    secure: NODE_ENV === "prodution",
    httpOnly: NODE_ENV === "production",
  };
  res.cookie("jwt", token, options);

  user.password = null;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

//* API

export const register = async (req, res) => {
  const { email, password, username, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });
    const user = await User.create({
      email,
      password,
      username,
      currentPassword: password,
    });
    sendToken(user, 201, req, res);
  } catch (error) {
    console.log(error);
    const errors = handleErrors(error);
    res.status(401).json({ errors });
  }
};

export const update = async (req, res) => {
  console.log(req);
  console.log("from update");
  try {
    const user = await User.findOne({ _id: req.user._id });

    const password = req.body.newPassword
      ? req.body.newPassword
      : req.body.currentPassword;

    user.password = password;
    user.currentPassword = password;
    user.username = req.body.username;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;

    await user.save();

    sendToken(user, 201, req, res);
  } catch (error) {
    console.log(error);
    const errors = handleErrors(error);
    res.status(401).json({ errors });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    sendToken(user, 200, req, res);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

export const logout = async (req, res, next) => {
  try {
    const options = {
      expires: new Date(Date.now() + 10000),
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    };
    res.cookie("jwt", "expiredtoken", options);
    res.status(200).json({ status: "success" });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next();
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `${process.env.URL}/reset-password/${resetToken}`;

    // HTML Message
    const message = `
      <h1>Password Reset Request</h1><br/><br/><br/>
      <p>Hi ${user.username},</p><br/>
      <p>Someone has requested a new password for the following account on PhiliGrub:</p><br/>
      <p>Username: ${user.username}</p><br/>
      <p>If you didn't make this request, just ignore this email. If you'd like to proceed:</p><br/>
      <a href=${resetUrl} clicktracking=off>Click here to reset your password</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res
        .status(200)
        .json({ success: true, data: "Password reset email has been sent." });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next();
    }
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next();
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Your password has been reset successfully.",
    });
  } catch (err) {
    next(err);
  }
};

const tokenChecker = async (req, res, next) => {
  try {
    let token;
    if (req.cookies) token = req.cookies.jwt;

    if (!token || token === "expiredtoken") {
      return next();
    }

    const jwtInfo = await decryptJwt(token);
    console.log(jwtInfo);
    if (jwtInfo.exp < Date.now() / 1000) {
      return next();
    }
    const user = await User.findById(jwtInfo.id);
    if (!user) {
      return next();
    }

    return user;
  } catch (error) {
    next(error);
  }
};

export const checkUserCred = async (req, res, next) => {
  const user = await tokenChecker(req, res, next);
  res.status(200).json({
    status: "success",
    user,
  });
};

export const addUserToRequest = async (req, res, next) => {
  const user = await tokenChecker(req, res, next);
  req.user = user;
  next();
};

//=================================//
//*********** ADDRESSES ***********//
//=================================//

export const billingAddress = async (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { billingAddress: req.body },
    },
    { overwrite: true, runValidators: true },
    (err, userInfo) => {
      if (err) {
        const errors = handleErrors(err);
        console.log(errors);
        return res.status(400).json({ errors });
      }

      return res.status(200).json(userInfo);
    }
  );
};

export const shippingAddress = async (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { shippingAddress: req.body },
    },
    { overwrite: true, runValidators: true },
    (err, userInfo) => {
      if (err) {
        const errors = handleErrors(err);
        console.log(errors);
        return res.status(400).json({ errors });
      }

      return res.status(200).json(userInfo);
    }
  );
};

//=================================//
//************** CART *************//
//=================================//

export const addToCart = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: { cart: req.body },
    },
    { overwrite: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json(userInfo.cart);
    }
  );
};

export const updateCart = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { cart: req.body },
    },
    { overwrite: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json(userInfo.cart);
    }
  );
};

export const clearCart = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { cart: [], checkout: {} },
    },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ status: "Cart Cleared!" });
    }
  );
};

//=================================//
//************ CHECKOUT ***********//
//=================================//

export const checkout = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { checkout: req.body },
    },
    { overwrite: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json(userInfo.checkout);
    }
  );
};
