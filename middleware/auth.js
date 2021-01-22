import { decryptJwt } from "../controllers/auth.js";
import User from "../models/user.js";

export const secure = async (req, res, next) => {
  let token;
  if (req.cookies) token = req.cookies.jwt;
  if (!token) {
    console.log("no token");
  }
  if (!token || token === "expiredtoken") {
    return res.status(401).json({
      status: "unauthorized",
      message: "You are not authorized to view this content",
    });
  }
  const jwtInfo = await decryptJwt(token);
  const user = await User.findById(jwtInfo.id);
  if (!user) {
    console.log("not a user");

    return res.status(401).json({
      status: "unauthorized",
      message: "You are not authorized to view this content",
    });
  }

  req.user = user;
  next();
};

export const clearanceLevel = (...clearanceLevel) => {
  return (req, res, next) => {
    clearanceLevel.includes(req.user.role)
      ? next(console.log("clearance ok!"))
      : res.status(401).json({
          status: "unauthorized",
          message: "Content not available at your current role",
        });
  };
};

export const blackList = (...inputs) => {
  return (req, res, next) => {
    const { body } = req;
    console.log(body);
    let bodyProps;
    for (let prop in inputs) {
      bodyProps = inputs[prop];
      if (body[bodyProps]) delete body[bodyProps];
    }
    console.log(req.body);
    next();
  };
};
