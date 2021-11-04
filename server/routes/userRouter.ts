import express from "express";
import { userCtrl } from "../controllers/usersController";

const userRouter = express.Router();

/**
 * @api {post} /user/signup Créer un nouvel administrateur
 * @apiName RegisterUser
 * @apiGroup Administrateur
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {String} password password.
 * @apiParam {String} firstName User firstName.
 * @apiParam {String} lastName User lastName.
 *
 * @apiSuccess {String} userId User id.
 * @apiSuccess {String} token jwt.
 *
 */
userRouter.post("/signup", userCtrl.signup);

/**
 * @api {post} /user/login Login d'un administrateur
 * @apiName LogUser
 * @apiGroup Administrateur
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} userId User id.
 * @apiSuccess {String} token jwt.
 *
 */
userRouter.post("/login", userCtrl.login);

export { userRouter };
