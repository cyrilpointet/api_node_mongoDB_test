import express from "express";
import { userCtrl } from "../controllers/usersController";

const userRouter = express.Router();

userRouter.post("/signup", userCtrl.signup);
userRouter.post("/login", userCtrl.login);

export { userRouter };
