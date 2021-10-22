import express from "express";
import { auth } from "../middleware/auth";
import { memberCtrl } from "../controllers/membersController";

const memberRouter = express.Router();

memberRouter.get("/", auth, memberCtrl.getAllMembers);
memberRouter.put("/:id", auth, memberCtrl.updateMember);
memberRouter.get("/:id", auth, memberCtrl.getMemberById);

export { memberRouter };
