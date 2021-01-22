import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import messageRoutes from "./routes/message.js";
import deliveryRoutes from "./routes/delivery.js";
import stripeRoutes from "./routes/stripe.js";
import { blackList } from "./middleware/auth.js";
import ImageUploadRoutes from "./routes/uploadImageRoute.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: process.env.URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(blackList("role"));

app.use("/auth", authRoutes);
app.use("/menus", menuRoutes);
app.use("/messages", messageRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/fileupload", ImageUploadRoutes);
app.use("/stripe", stripeRoutes);

// const CONNECTION_URL =
//   "mongodb+srv://memories:memories123@cluster0.ixqfi.mongodb.net/social?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
// mongoose.set("useFindAndModify", false);
