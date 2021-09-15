import express from "express";
import index from "../resources/html/index.html";

const indexRouter = express.Router();

indexRouter.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + index);
});

export { indexRouter };
