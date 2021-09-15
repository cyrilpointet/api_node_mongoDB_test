import express from "express";

const docRouter = express.Router();

docRouter.get("/", function (req, res) {
  res.redirect("/doc/index.html");
});

export { docRouter };
