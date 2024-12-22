import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import cookiesParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(helmet());
app.use(cookiesParser());
app.use(express.json());
app.use(express(urlencoded({ extended: true })));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.json({ message: "server loading..." });
});

app.listen(process.env.PORT || 8083, () => {
  console.log("listening...");
});
