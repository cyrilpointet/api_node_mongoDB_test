import express from "express";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import index from "../../client/views/index.html";

const indexRouter = express.Router();

indexRouter.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + index);
});

export { indexRouter };
