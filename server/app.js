import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { mongodb } from "../db/mongo";

// Routes
import { indexRouter } from "../routes/index";
import { userRouter } from "../routes/userRouter";
import { articleRouter } from "../routes/articleRouter";
import { memberRouter } from "../routes/memberRouter";
import { groupRouter } from "../routes/groupRouter";

// DB
mongodb.initClientDbConnection();

const app = express();

app.use(
  cors({
    exposedHeaders: ["Authorization"],
    origin: "*",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/article", articleRouter);
app.use("/member", memberRouter);
app.use("/group", groupRouter);
app.use(function (req, res) {
  res
    .status(404)
    .json({ name: "API", version: "1.0", status: 404, message: "not_found" });
});

export { app };
