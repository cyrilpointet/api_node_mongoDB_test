import express from "express";
import { auth } from "../middleware/auth";
import { groupCtrl } from "../controllers/groupsController";

const groupRouter = express.Router();

groupRouter.get("/", auth, groupCtrl.getAllGroups);
groupRouter.get("/:id", auth, groupCtrl.getGroupById);
groupRouter.put("/:id", auth, groupCtrl.updateGroup);
groupRouter.delete("/:id", auth, groupCtrl.deleteGroup);

export { groupRouter };
